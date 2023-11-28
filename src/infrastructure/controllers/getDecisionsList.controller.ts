import { Controller, Get, HttpStatus, Logger, Query, Request } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { LabelStatus } from 'dbsder-api-types'
import { ApiKeyValidation } from '../auth/apiKeyValidation'
import { DatabaseError } from '../../domain/errors/database.error'
import { DecisionSearchCriteria } from '../../domain/decisionSearchCriteria'
import { ListDecisionsUsecase } from '../../usecase/listDecisions.usecase'
import { GetDecisionsListResponse } from './responses/getDecisionsList.response'
import { UnexpectedException } from '../exceptions/unexpected.exception'
import { DependencyException } from '../exceptions/dependency.exception'
import { ClientNotAuthorizedException } from '../exceptions/clientNotAuthorized.exception'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { ValidateDtoPipe } from '../pipes/validateDto.pipe'
import { LogsFormat } from '../utils/logsFormat.utils'

@ApiTags('DbSder')
@Controller('decisions')
export class ListDecisionsController {
  constructor(private readonly decisionsRepository: DecisionsRepository) {}

  private readonly logger = new Logger()

  @Get()
  @ApiHeader({
    name: 'x-api-key',
    description: 'Clé API'
  })
  @ApiQuery({
    name: 'status',
    description: 'Décision intègre au format wordperfect et metadonnées associées.',
    enum: LabelStatus
  })
  @ApiQuery({
    name: 'startDate',
    description: 'date de début de la période de recherche'
  })
  @ApiQuery({
    name: 'endDate',
    description: 'date de fin de la période de recherche'
  })
  @ApiOkResponse({ description: 'Une liste de décisions', type: [GetDecisionsListResponse] })
  @ApiBadRequestResponse({
    description: "Le paramètre écrit n'est présent dans la liste des valeurs acceptées"
  })
  @ApiUnauthorizedResponse({
    description: "Vous n'êtes pas autorisé à appeler cette route"
  })
  async getDecisions(
    @Query(new ValidateDtoPipe()) getDecisionListCriteria: DecisionSearchCriteria,
    @Request() req
  ): Promise<GetDecisionsListResponse[]> {
    const routePath = req.method + ' ' + req.path
    const formatLogs: LogsFormat = {
      operationName: 'getDecisions',
      httpMethod: req.method,
      path: req.path,
      msg: `${routePath} called with ${JSON.stringify(getDecisionListCriteria)}`
    }
    this.logger.log(formatLogs)

    const authorizedApiKeys = [
      process.env.LABEL_API_KEY,
      process.env.INDEX_API_KEY,
      process.env.ATTACHMENTS_API_KEY
    ]

    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ClientNotAuthorizedException()
    }

    const listDecisionUsecase = new ListDecisionsUsecase(this.decisionsRepository)

    const decisionList = await listDecisionUsecase
      .execute(getDecisionListCriteria)
      .catch((error) => {
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

    this.logger.log({
      ...formatLogs,
      msg: routePath + ' returns ' + HttpStatus.OK,
      data: { decisions: decisionList },
      statusCode: HttpStatus.OK
    })
    return decisionList
  }
}
