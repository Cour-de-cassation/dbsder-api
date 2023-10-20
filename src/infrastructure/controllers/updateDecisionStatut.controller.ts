import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseEnumPipe,
  Put,
  Request
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { LabelStatus } from 'dbsder-api-types'
import { ApiKeyValidation } from '../auth/apiKeyValidation'
import { DatabaseError, UpdateFailedError } from '../../domain/errors/database.error'
import { UnprocessableException } from '../exceptions/unprocessable.exception'
import { DecisionNotFoundError } from '../../domain/errors/decisionNotFound.error'
import { UpdateStatutUsecase } from '../../usecase/updateStatut.usecase'
import { UpdateDecisionStatutDTO } from '../dto/updateDecision.dto'
import { UnexpectedException } from '../exceptions/unexpected.exception'
import { DependencyException } from '../exceptions/dependency.exception'
import { DecisionNotFoundException } from '../exceptions/decisionNotFound.exception'
import { ClientNotAuthorizedException } from '../exceptions/clientNotAuthorized.exception'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { LogsFormat } from '../utils/logsFormat.utils'

@ApiTags('DbSder')
@Controller('decisions')
export class UpdateDecisionStatutController {
  constructor(private readonly decisionsRepository: DecisionsRepository) {}

  private readonly logger = new Logger()

  @Put(':id/statut')
  @HttpCode(204)
  @ApiHeader({
    name: 'x-api-key',
    description: 'Clé API'
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant de la décision'
  })
  @ApiBody({
    description: 'Statut de la décision',
    type: UpdateDecisionStatutDTO
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({
    description: 'Statut manquant ou invalide'
  })
  @ApiNotFoundResponse({
    description: "La decision n'a pas été trouvée"
  })
  @ApiUnauthorizedResponse({
    description: "Vous n'êtes pas autorisé à appeler cette route"
  })
  async updateDecisionStatut(
    @Param('id') id: string,
    @Body('statut', new ParseEnumPipe(LabelStatus)) labelStatus: UpdateDecisionStatutDTO,
    @Request() req
  ): Promise<void> {
    const authorizedApiKeys = [process.env.LABEL_API_KEY, process.env.PUBLICATION_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ClientNotAuthorizedException()
    }

    const formatLogs: LogsFormat = {
      operationName: 'updateDecisionStatut',
      httpMethod: req.method,
      path: req.path,
      msg: `PUT /decisions/id/statut called with ID ${id} and status ${labelStatus}`
    }
    this.logger.log(formatLogs)

    const updateDecisionUsecase = new UpdateStatutUsecase(this.decisionsRepository)
    await updateDecisionUsecase.execute(id, labelStatus.toString()).catch((error) => {
      if (error instanceof DecisionNotFoundError) {
        this.logger.error({ ...formatLogs, msg: error.message, statusCode: HttpStatus.NOT_FOUND })
        throw new DecisionNotFoundException()
      }
      if (error instanceof UpdateFailedError) {
        this.logger.error({
          ...formatLogs,
          msg: error.message,
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
        throw new UnprocessableException(id, labelStatus.toString(), error.message)
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
