import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseEnumPipe,
  Put,
  Query,
  Request,
  UsePipes
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { LabelStatus } from 'dbsder-api-types'
import { ApiKeyValidation } from '../auth/apiKeyValidation'
import { DatabaseError, UpdateFailedError } from '../../domain/errors/database.error'
import { DecisionSearchCriteria } from '../../domain/decisionSearchCriteria'
import { UnprocessableException } from '../exceptions/unprocessable.exception'
import { DecisionNotFoundError } from '../../domain/errors/decisionNotFound.error'
import { ListDecisionsUsecase } from '../../usecase/listDecisions.usecase'
import { CreateDecisionUsecase } from '../../usecase/createDecision.usecase'
import { FetchDecisionByIdUsecase } from '../../usecase/fetchDecisionById.usecase'
import { UpdateStatutUsecase } from '../../usecase/updateStatut.usecase'
import { UpdateDecisionPseudonymiseeUsecase } from '../../usecase/updateDecisionPseudonymisee.usecase'
import { UpdateRapportsOccultationsUsecase } from '../../usecase/updateRapportsOccultations.usecase'
import { CreateDecisionDTO } from '../dto/createDecision.dto'
import {
  UpdateDecisionPseudonymiseeDTO,
  UpdateDecisionRapportsOccultationsDTO,
  UpdateDecisionStatutDTO
} from '../dto/updateDecision.dto'
import { CreateDecisionResponse } from './responses/createDecisionResponse'
import { GetDecisionByIdResponse } from './responses/getDecisionById.response'
import { GetDecisionsListResponse } from './responses/getDecisionsListResponse'
import { UnexpectedException } from '../exceptions/unexpected.exception'
import { DependencyException } from '../exceptions/dependency.exception'
import { ForbiddenRouteException } from '../exceptions/forbiddenRoute.exception'
import { DecisionNotFoundException } from '../exceptions/decisionNotFound.exception'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { ValidateDtoPipe } from '../pipes/validateDto.pipe'
import { LogsFormat } from '../utils/logsFormat.utils'

@ApiTags('DbSder')
@Controller('decisions')
export class DecisionsController {
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
  @ApiOkResponse({ description: 'Une liste de décisions' })
  @ApiBadRequestResponse({
    description: "Le paramètre écrit n'est présent dans la liste des valeurs acceptées"
  })
  @ApiUnauthorizedResponse({
    description: "Vous n'avez pas accès à cette route"
  })
  @ApiForbiddenResponse({
    description: "Vous n'avez pas accès à cette route"
  })
  async getDecisions(
    @Query(new ValidateDtoPipe()) getDecisionListCriteria: DecisionSearchCriteria,
    @Request() req
  ): Promise<GetDecisionsListResponse[]> {
    const authorizedApiKeys = [
      process.env.LABEL_API_KEY,
      process.env.INDEX_API_KEY,
      process.env.ATTACHMENTS_API_KEY
    ]

    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ForbiddenRouteException()
    }
    const formatLogs: LogsFormat = {
      operationName: 'getDecisions',
      httpMethod: req.method,
      path: req.path,
      msg: `GET /decisions called with ${JSON.stringify(getDecisionListCriteria)}`
    }

    this.logger.log(formatLogs)

    const listDecisionUsecase = new ListDecisionsUsecase(this.decisionsRepository)

    return await listDecisionUsecase.execute(getDecisionListCriteria).catch((error) => {
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

  @Get(':id')
  @ApiHeader({
    name: 'x-api-key',
    description: 'Clé API'
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant de la décision'
  })
  @ApiOkResponse({ description: 'La décision', type: GetDecisionByIdResponse })
  @ApiNotFoundResponse({
    description: "La decision n'a pas été trouvée"
  })
  @ApiUnauthorizedResponse({
    description: "Vous n'avez pas accès à cette route"
  })
  @ApiForbiddenResponse({
    description: "Vous n'avez pas accès à cette route"
  })
  async getDecisionById(@Param('id') id: string, @Request() req): Promise<GetDecisionByIdResponse> {
    const authorizedApiKeys = [process.env.LABEL_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ForbiddenRouteException()
    }
    const fetchDecisionByIdUsecase = new FetchDecisionByIdUsecase(this.decisionsRepository)

    const formatLogs: LogsFormat = {
      operationName: 'getDecisionById',
      httpMethod: req.method,
      path: req.path,
      msg: `GET /decisions/:id called with id ${id}`
    }
    this.logger.log(formatLogs)

    return await fetchDecisionByIdUsecase.execute(id).catch((error) => {
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
    description: "Vous n'avez pas accès à cette route"
  })
  @ApiForbiddenResponse({
    description: "Vous n'avez pas accès à cette route"
  })
  async updateDecisionStatut(
    @Param('id') id: string,
    @Body('statut', new ParseEnumPipe(LabelStatus)) labelStatus: UpdateDecisionStatutDTO,
    @Request() req
  ): Promise<void> {
    const authorizedApiKeys = [process.env.LABEL_API_KEY, process.env.PUBLICATION_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ForbiddenRouteException()
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
    description: "Vous n'avez pas accès à cette route"
  })
  @ApiForbiddenResponse({
    description: "Vous n'avez pas accès à cette route"
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
      throw new ForbiddenRouteException()
    }

    const formatLogs: LogsFormat = {
      operationName: 'updateDecisionRapportsOccultations',
      httpMethod: req.method,
      path: req.path,
      msg: `PUT /decisions/id/rapport-occultations called with ID ${id} and rapportsOccultations`
    }
    this.logger.log(formatLogs)

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
        throw new UnprocessableException(
          id,
          JSON.stringify(body.rapportsOccultations),
          error.message
        )
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
