import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  Query,
  Request,
  UsePipes,
  ValidationPipe
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
import { ApiKeyValidation } from '../auth/apiKeyValidation'
import { DecisionStatus } from '../../domain/enum'
import { DatabaseError, UpdateFailedError } from '../../domain/errors/database.error'
import { DecisionSearchCriteria } from '../../domain/decisionSearchCriteria'
import { UnprocessableException } from '../exceptions/unprocessable.exception'
import { DecisionNotFoundError } from '../../domain/errors/decisionNotFound.error'
import { ListDecisionsUsecase } from '../../usecase/listDecisions.usecase'
import { CreateDecisionUsecase } from '../../usecase/createDecision.usecase'
import { FetchDecisionByIdUsecase } from '../../usecase/fetchDecisionById.usecase'
import { UpdateDecisionStatusUsecase } from '../../usecase/updateDecisionStatus.usecase'
import { CreateDecisionDTO } from '../dto/createDecision.dto'
import {
  UpdateDecisionPseudonymisedDecisionDTO,
  UpdateDecisionStatusDTO
} from '../dto/updateDecision.dto'
import { CreateDecisionResponse } from './responses/createDecisionResponse'
import { GetDecisionByIdResponse } from './responses/getDecisionById.response'
import { GetDecisionsListResponse } from './responses/getDecisionsListResponse'
import { UnexpectedException } from '../exceptions/unexpected.exception'
import { DependencyException } from '../exceptions/dependency.exception'
import { ForbiddenRouteException } from '../exceptions/forbiddenRoute.exception'
import { DecisionNotFoundException } from '../exceptions/decisionNotFound.exception'
import { MongoRepository } from '../db/repositories/mongo.repository'
import { ValidateDtoPipe } from '../pipes/validateDto.pipe'

@ApiTags('DbSder')
@Controller('decisions')
export class DecisionsController {
  constructor(private readonly mongoRepository: MongoRepository) {}

  private readonly logger = new Logger()

  @Get()
  @ApiHeader({
    name: 'x-api-key',
    description: 'Clé API'
  })
  @ApiQuery({
    name: 'status',
    description: 'Décision intègre au format wordperfect et metadonnées associées.',
    enum: DecisionStatus
  })
  @ApiOkResponse({ description: 'Une liste de décisions' })
  @ApiBadRequestResponse({
    description: "Le paramètre  écrit n'est présent dans la liste des valeurs acceptées"
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
    const authorizedApiKeys = [process.env.LABEL_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ForbiddenRouteException()
    }
    this.logger.log('GET /decisions called with status ' + getDecisionListCriteria.status)

    const listDecisionUsecase = new ListDecisionsUsecase(this.mongoRepository)

    return await listDecisionUsecase.execute(getDecisionListCriteria).catch((error) => {
      this.logger.error(error.message)
      if (error instanceof DatabaseError) {
        throw new DependencyException(error.message)
      }
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
    const fetchDecisionByIdUsecase = new FetchDecisionByIdUsecase(this.mongoRepository)
    this.logger.log('GET /decisions/:id called with ID ' + id)
    return await fetchDecisionByIdUsecase.execute(id).catch((error) => {
      this.logger.error(error.message)
      if (error instanceof DecisionNotFoundError) {
        throw new DecisionNotFoundException()
      }
      if (error instanceof DatabaseError) {
        throw new DependencyException(error.message)
      }
      throw new UnexpectedException(error.message)
    })
  }

  @Post()
  @ApiHeader({
    name: 'x-api-key',
    description: 'Clé API'
  })
  @ApiBody({
    description: 'Décision intègre au format wordperfect et metadonnées associées.',
    type: CreateDecisionDTO
  })
  @ApiCreatedResponse({ description: 'Décision créée' })
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
    this.logger.log('POST /decisions called with ' + JSON.stringify(decision))
    const authorizedApiKeys = [process.env.NORMALIZATION_API_KEY, process.env.OPENSDER_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ForbiddenRouteException()
    }

    const createDecisionUsecase = new CreateDecisionUsecase(this.mongoRepository)
    const decisionCreated = await createDecisionUsecase.execute(decision).catch((error) => {
      this.logger.error(error.message)
      if (error instanceof DatabaseError) {
        throw new DependencyException(error.message)
      }
      throw new UnexpectedException(error)
    })
    return {
      id: decisionCreated.id,
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
    type: UpdateDecisionStatusDTO
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
  async updateDecisionStatus(
    @Param('id') id: string,
    @Body('statut', new ParseEnumPipe(DecisionStatus)) decisionStatus: UpdateDecisionStatusDTO,
    @Request() req
  ): Promise<void> {
    const authorizedApiKeys = [process.env.LABEL_API_KEY, process.env.PUBLICATION_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ForbiddenRouteException()
    }
    this.logger.log(`PUT /decisions/id/statut called with ID ${id} and status ${decisionStatus}`)

    const updateDecisionUsecase = new UpdateDecisionStatusUsecase(this.mongoRepository)
    await updateDecisionUsecase.execute(id, decisionStatus.toString()).catch((error) => {
      this.logger.error(error.message)
      if (error instanceof DecisionNotFoundError) {
        throw new DecisionNotFoundException()
      }
      if (error instanceof UpdateFailedError) {
        throw new UnprocessableException(id, decisionStatus.toString(), error.message)
      }
      if (error instanceof DatabaseError) {
        throw new DependencyException(error.message)
      }
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
    type: UpdateDecisionPseudonymisedDecisionDTO
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
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateDecisionPseudonymisedDecision(
    @Param('id') id: string,
    @Body() decisionPseudonymisee: UpdateDecisionPseudonymisedDecisionDTO,
    @Request() req
  ): Promise<void> {
    const authorizedApiKeys = [process.env.LABEL_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ForbiddenRouteException()
    }
    this.logger.log(
      `PUT /decisions/id/decision-pseudonymisee called with ID ${id} and decisionPseudonymisee ${decisionPseudonymisee}`
    )

    // const updateDecisionUsecase = new UpdateDecisionStatusUsecase(this.mongoRepository)
    // await updateDecisionUsecase.execute(id, decisionStatus.toString()).catch((error) => {
    //   this.logger.error(error.message)
    //   if (error instanceof DecisionNotFoundError) {
    //     throw new DecisionNotFoundException()
    //   }
    //   if (error instanceof UpdateFailedError) {
    //     throw new UnprocessableException(id, decisionStatus.toString(), error.message)
    //   }
    //   if (error instanceof DatabaseError) {
    //     throw new DependencyException(error.message)
    //   }
    //   throw new UnexpectedException(error)
    // })
  }
}
