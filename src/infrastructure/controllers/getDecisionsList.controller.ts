import { Controller, Get, HttpStatus, Logger, Query, Request } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
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
import { DateTypeValidation } from '../utils/dateType.utils'
import { MissingFieldException } from '../exceptions/missingField.exception'

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

    // throw error if dateType defined and startDate and endDate not defined
    if (
      getDecisionListCriteria &&
      DateTypeValidation.isValidDateType(getDecisionListCriteria.dateType)
    ) {
      if (!getDecisionListCriteria.startDate && !getDecisionListCriteria.endDate) {
        throw new MissingFieldException('dateType avec startDate ou endDate')
      }
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
