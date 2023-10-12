import { Body, Controller, HttpStatus, Logger, Put, Request, UsePipes } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { ApiKeyValidation } from '../auth/apiKeyValidation'
import { DatabaseError } from '../../domain/errors/database.error'
import { CreateDecisionUsecase } from '../../usecase/createDecision.usecase'
import { CreateDecisionDTO } from '../dto/createDecision.dto'
import { CreateDecisionResponse } from './responses/createDecisionResponse'
import { UnexpectedException } from '../exceptions/unexpected.exception'
import { DependencyException } from '../exceptions/dependency.exception'
import { ForbiddenRouteException } from '../exceptions/forbiddenRoute.exception'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { ValidateDtoPipe } from '../pipes/validateDto.pipe'
import { LogsFormat } from '../utils/logsFormat.utils'

@ApiTags('DbSder')
@Controller('decisions')
export class CreateDecisionsController {
  constructor(private readonly decisionsRepository: DecisionsRepository) {}

  private readonly logger = new Logger()

  @Put()
  @ApiHeader({
    name: 'x-api-key',
    description: 'Clé API'
  })
  @ApiBody({
    description: 'Décision intègre au format wordperfect et metadonnées associées.',
    type: CreateDecisionDTO
  })
  @ApiCreatedResponse({ description: 'Décision créée', status: HttpStatus.OK })
  @ApiBadRequestResponse({
    description: 'Il manque un ou plusieurs champs obligatoires dans la décision'
  })
  @ApiUnauthorizedResponse({
    description: "Vous n'avez pas accès à cette route"
  })
  @ApiForbiddenResponse({
    description: "Vous n'avez pas accès à cette route"
  })
  @UsePipes()
  async createDecisions(
    @Request() req,
    @Body('decision', new ValidateDtoPipe()) decision: CreateDecisionDTO
  ): Promise<CreateDecisionResponse> {
    const formatLogs: LogsFormat = {
      operationName: 'createDecisions',
      httpMethod: req.method,
      path: req.path,
      msg: `PUT /decisions called with ${JSON.stringify(decision)}`
    }
    this.logger.log(formatLogs)

    const authorizedApiKeys = [process.env.NORMALIZATION_API_KEY, process.env.OPENSDER_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ForbiddenRouteException()
    }

    const createDecisionUsecase = new CreateDecisionUsecase(this.decisionsRepository)
    const decisionCreated = await createDecisionUsecase.execute(decision).catch((error) => {
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
    return {
      _id: decisionCreated._id,
      message: 'Decision créée'
    }
  }
}
