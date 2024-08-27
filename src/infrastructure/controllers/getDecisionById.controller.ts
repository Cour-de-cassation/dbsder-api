import { Controller, Get, HttpStatus, Logger, Param, Request } from '@nestjs/common'
import {
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { ApiKeyValidation } from '../auth/apiKeyValidation'
import { DatabaseError } from '../../domain/errors/database.error'
import { DecisionNotFoundError } from '../../domain/errors/decisionNotFound.error'
import { FetchDecisionByIdUsecase } from '../../usecase/fetchDecisionById.usecase'
import { GetDecisionByIdResponse } from './responses/getDecisionById.response'
import { UnexpectedException } from '../exceptions/unexpected.exception'
import { DependencyException } from '../exceptions/dependency.exception'
import { DecisionNotFoundException } from '../exceptions/decisionNotFound.exception'
import { ClientNotAuthorizedException } from '../exceptions/clientNotAuthorized.exception'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { LogsFormat } from '../utils/logsFormat.utils'
import { MapModelToResponseService } from '../../service/mapModelToResponse.service'

@ApiTags('DbSder')
@Controller('decisions')
export class GetDecisionByIdController {
  constructor(private readonly decisionsRepository: DecisionsRepository,private readonly mapModelToResponseService: MapModelToResponseService) {}

  private readonly logger = new Logger()

  @Get(':id')
  @ApiHeader({
    name: 'x-api-key',
    description: 'Clé API'
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant de la décision'
  })
  @ApiOkResponse({ description: 'Décision trouvée', type: GetDecisionByIdResponse })
  @ApiNotFoundResponse({
    description: "La decision n'a pas été trouvée"
  })
  @ApiUnauthorizedResponse({
    description: "Vous n'êtes pas autorisé à appeler cette route"
  })
  async getDecisionById(@Param('id') id: string, @Request() req): Promise<GetDecisionByIdResponse> {
    const routePath = req.method + ' ' + req.path
    const formatLogs: LogsFormat = {
      operationName: 'getDecisionById',
      httpMethod: req.method,
      path: req.path,
      msg: `${routePath} called with id ${id}`
    }
    this.logger.log(formatLogs)

    const authorizedApiKeys = [process.env.LABEL_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ClientNotAuthorizedException()
    }
    const fetchDecisionByIdUsecase = new FetchDecisionByIdUsecase(this.decisionsRepository,this.mapModelToResponseService)

    const foundDecision = await fetchDecisionByIdUsecase.execute(id).catch((error) => {
      if (error instanceof DecisionNotFoundError) {
        this.logger.error({ ...formatLogs, msg: error.message, statusCode: HttpStatus.NOT_FOUND })
        throw new DecisionNotFoundException()
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
      throw new UnexpectedException(error.message)
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const decisionToLog = {
      sourceId: foundDecision.sourceId,
      sourceName: foundDecision.sourceName,
      idDecision: foundDecision.idDecisionWinci,
      jurisdictionCode: foundDecision.jurisdictionCode,
      dateDecision: foundDecision.dateDecision,
      numeroRoleGeneral: foundDecision.numeroRoleGeneral,
      numeroRegistre: foundDecision.registerNumber
    }
    this.logger.log({
      ...formatLogs,
      msg: routePath + ' returns ' + HttpStatus.OK,
      data: { decision: decisionToLog },
      statusCode: HttpStatus.OK
    })
    return foundDecision
  }
}
