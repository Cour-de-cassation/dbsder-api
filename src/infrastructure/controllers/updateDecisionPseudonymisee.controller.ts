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
  ApiForbiddenResponse,
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
import { UpdateDecisionPseudonymiseeUsecase } from '../../usecase/updateDecisionPseudonymisee.usecase'
import { UpdateDecisionPseudonymiseeDTO } from '../dto/updateDecision.dto'
import { UnexpectedException } from '../exceptions/unexpected.exception'
import { DependencyException } from '../exceptions/dependency.exception'
import { ForbiddenRouteException } from '../exceptions/forbiddenRoute.exception'
import { DecisionNotFoundException } from '../exceptions/decisionNotFound.exception'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { ValidateDtoPipe } from '../pipes/validateDto.pipe'
import { LogsFormat } from '../utils/logsFormat.utils'

@ApiTags('DbSder')
@Controller('decisions')
export class UpdateDecisionPseudonymiseeController {
  constructor(private readonly decisionsRepository: DecisionsRepository) {}

  private readonly logger = new Logger()

  @Put(':id/decision-pseudonymisee')
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
    description: 'Décision pseudonymisée de la décision',
    type: UpdateDecisionPseudonymiseeDTO
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({
    description: 'Statut manquant ou invalide'
  })
  @ApiNotFoundResponse({
    description: "La decision n'a pas été trouvée"
  })
  @ApiUnauthorizedResponse({
    description: "Vous n'avez pas accès à cette route"
  })
  @ApiForbiddenResponse({
    description: "Vous n'avez pas accès à cette route"
  })
  @UsePipes()
  async updateDecisionPseudonymisee(
    @Param('id') id: string,
    @Body(new ValidateDtoPipe()) body: UpdateDecisionPseudonymiseeDTO,
    @Request() req
  ): Promise<void> {
    const authorizedApiKeys = [process.env.LABEL_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ForbiddenRouteException()
    }

    const formatLogs: LogsFormat = {
      operationName: 'updateDecisionPseudonymisee',
      httpMethod: req.method,
      path: req.path,
      msg: `PUT /decisions/id/decision-pseudonymisee called with ID ${id} and decisionPseudonymisee ${body.decisionPseudonymisee}`
    }
    this.logger.log(formatLogs)

    const updateDecisionUsecase = new UpdateDecisionPseudonymiseeUsecase(this.decisionsRepository)
    await updateDecisionUsecase.execute(id, body.decisionPseudonymisee).catch((error) => {
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
        throw new UnprocessableException(id, body.decisionPseudonymisee, error.message)
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