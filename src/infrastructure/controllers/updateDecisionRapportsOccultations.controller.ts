import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Put,
  Request,
  UsePipes
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
import { ApiKeyValidation } from '../auth/apiKeyValidation'
import { DatabaseError, UpdateFailedError } from '../../domain/errors/database.error'
import { UnprocessableException } from '../exceptions/unprocessable.exception'
import { DecisionNotFoundError } from '../../domain/errors/decisionNotFound.error'
import { UpdateRapportsOccultationsUsecase } from '../../usecase/updateRapportsOccultations.usecase'
import { UpdateDecisionRapportsOccultationsDTO } from '../dto/updateDecision.dto'
import { UnexpectedException } from '../exceptions/unexpected.exception'
import { DependencyException } from '../exceptions/dependency.exception'
import { DecisionNotFoundException } from '../exceptions/decisionNotFound.exception'
import { ClientNotAuthorizedException } from '../exceptions/clientNotAuthorized.exception'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { ValidateDtoPipe } from '../pipes/validateDto.pipe'
import { LogsFormat } from '../utils/logsFormat.utils'

@ApiTags('DbSder')
@Controller('decisions')
export class UpdateDecisionRapportsOccultationsController {
  constructor(private readonly decisionsRepository: DecisionsRepository) {}

  private readonly logger = new Logger()

  @Put(':id/rapports-occultations')
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
    description: `Rapport d'occultations de la décision`,
    type: UpdateDecisionRapportsOccultationsDTO
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
  @UsePipes()
  async updateDecisionRapportsOccultations(
    @Param('id') id: string,
    @Body(new ValidateDtoPipe()) body: UpdateDecisionRapportsOccultationsDTO,
    @Request() req
  ): Promise<void> {
    const authorizedApiKeys = [process.env.LABEL_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ClientNotAuthorizedException()
    }

    const formatLogs: LogsFormat = {
      operationName: 'updateDecisionRapportsOccultations',
      httpMethod: req.method,
      path: req.path,
      msg: 'PUT /decisions/id/rapport-occultations called'
    }
    this.logger.log({
      ...formatLogs,
      data: { id, rapportsOccultations: body.rapportsOccultations }
    })

    const updateDecisionUsecase = new UpdateRapportsOccultationsUsecase(this.decisionsRepository)
    await updateDecisionUsecase.execute(id, body.rapportsOccultations).catch((error) => {
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
