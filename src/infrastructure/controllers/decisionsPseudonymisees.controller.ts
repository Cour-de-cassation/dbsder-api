import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseBoolPipe,
  Query,
  Request
} from '@nestjs/common'
import {
  ApiForbiddenResponse,
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

import { UnexpectedException } from '../exceptions/unexpected.exception'
import { DependencyException } from '../exceptions/dependency.exception'
import { ForbiddenRouteException } from '../exceptions/forbiddenRoute.exception'
import { DecisionNotFoundException } from '../exceptions/decisionNotFound.exception'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { LogsFormat } from '../utils/logsFormat.utils'
import { GetDecisionPseudonymiseeByIdResponse } from './responses/getDecisionPseudonymiseeById.response'
import { FetchDecisionPseudonymiseeByIdUsecase } from '../../usecase/fetchDecisionPseudonymiseeByIdUsecase'

@ApiTags('DbSder')
@Controller('decisions-pseudonymisees')
export class DecisionsPseudonymiseesController {
  constructor(private readonly decisionsRepository: DecisionsRepository) {}

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
  @ApiOkResponse({ description: 'La décision', type: GetDecisionPseudonymiseeByIdResponse })
  @ApiNotFoundResponse({
    description: "La decision n'a pas été trouvée"
  })
  @ApiUnauthorizedResponse({
    description: "Vous n'avez pas accès à cette route"
  })
  @ApiForbiddenResponse({
    description: "Vous n'avez pas accès à cette route"
  })
  async getDecisionById(
    @Param('id') id: string,
    @Query('avecMetadonneesPersonnelles', new ParseBoolPipe()) avecMetadonneesPersonnelles: boolean,
    @Request() req
  ): Promise<GetDecisionPseudonymiseeByIdResponse> {
    const authorizedApiKeys = [
      process.env.OPENSDER_API_KEY,
      process.env.ATTACHMENTS_API_KEY,
      process.env.INDEX_API_KEY
    ]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ForbiddenRouteException()
    }
    if (avecMetadonneesPersonnelles) {
      if (apiKey !== process.env.OPENSDER_API_KEY) {
        throw new ForbiddenRouteException()
      }
    }
    const fetchDecisionPseudonymiseeByIdUsecase = new FetchDecisionPseudonymiseeByIdUsecase(
      this.decisionsRepository
    )

    const formatLogs: LogsFormat = {
      operationName: 'getDecisionById',
      httpMethod: req.method,
      path: req.path,
      msg: `GET /decisions/:id called with id ${id}`
    }
    this.logger.log(formatLogs)

    return await fetchDecisionPseudonymiseeByIdUsecase
      .execute(id, avecMetadonneesPersonnelles)
      .catch((error) => {
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
  }
}
