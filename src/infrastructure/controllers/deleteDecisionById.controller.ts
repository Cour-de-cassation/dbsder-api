import { Controller, Delete, HttpCode, HttpStatus, Logger, Param, Request } from '@nestjs/common'
import {
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { ApiKeyValidation } from '../auth/apiKeyValidation'
import { ClientNotAuthorizedException } from '../exceptions/clientNotAuthorized.exception'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { RemoveDecisionByIdUsecase } from '../../usecase/removeDecisionById.usecase'
import { DecisionNotFoundError } from '../../domain/errors/decisionNotFound.error'
import { LogsFormat } from '../utils/logsFormat.utils'
import { DependencyException } from '../exceptions/dependency.exception'
import { DecisionNotFoundException } from '../exceptions/decisionNotFound.exception'
import { DatabaseError, DeleteFailedError } from '../../domain/errors/database.error'
import { UnprocessableException } from '../exceptions/unprocessable.exception'
import { UnexpectedException } from '../exceptions/unexpected.exception'

@ApiTags('DbSder')
@Controller('decisions')
export class DeleteDecisionByIdController {
  constructor(private readonly decisionsRepository: DecisionsRepository) {}

  private readonly logger = new Logger()

  @Delete(':id')
  @HttpCode(204)
  @ApiHeader({
    name: 'x-api-key',
    description: 'Clé API'
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant de la décision'
  })
  @ApiNoContentResponse({ description: 'La décision a bien été supprimée' })
  @ApiNotFoundResponse({
    description: "La decision n'a pas été trouvée"
  })
  @ApiUnauthorizedResponse({
    description: "Vous n'êtes pas autorisé à appeler cette route"
  })
  async deleteDecisionById(@Param('id') id: string, @Request() req): Promise<void> {
    const authorizedApiKeys = [process.env.OPS_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ClientNotAuthorizedException()
    }
    const removeDecisionByIdUsecase = new RemoveDecisionByIdUsecase(this.decisionsRepository)

    const formatLogs: LogsFormat = {
      operationName: 'deleteDecisionById',
      httpMethod: req.method,
      path: req.path,
      msg: `DELETE /decisions/:id called with id ${id}`
    }
    this.logger.log(formatLogs)
    await removeDecisionByIdUsecase.execute(id).catch((error) => {
      if (error instanceof DecisionNotFoundError) {
        this.logger.error({ ...formatLogs, msg: error.message, statusCode: HttpStatus.NOT_FOUND })
        throw new DecisionNotFoundException()
      }
      if (error instanceof DeleteFailedError) {
        this.logger.error({
          ...formatLogs,
          msg: error.message,
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
        throw new UnprocessableException(id, error.message)
      }
      if (error instanceof DatabaseError) {
        this.logger.error({
          ...formatLogs,
          msg: error.message,
          statusCode: HttpStatus.SERVICE_UNAVAILABLE
        })
        throw new DependencyException(error.message)
      }
      this.logger.error({
        ...formatLogs,
        msg: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      })
      throw new UnexpectedException(error)
    })
  }
}
