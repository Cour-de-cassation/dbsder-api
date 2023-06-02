import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Logger,
  ParseEnumPipe,
  Post,
  Query,
  Request,
  UsePipes
} from '@nestjs/common'
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { MockUtils } from '../utils/mock.utils'
import { GetDecisionListDTO } from '../../domain/getDecisionList.dto'
import { DecisionStatus, Sources } from '../../domain/enum'
import { CreateDecisionDTO } from '../createDecisionDTO'
import { ValidateDtoPipe } from '../pipes/validateDto.pipe'
import { CreateDecisionUsecase } from '../../domain/usecase/createDecision.usecase'
import { MongoRepository } from '../db/repositories/mongo.repository'
import { CreateDecisionResponse } from './responses/createDecisionResponse'
import { ApiKeyValidation } from '../auth/apiKeyValidation'

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
  @ApiOkResponse({ description: 'Une liste de décisions', type: GetDecisionListDTO })
  @ApiBadRequestResponse({
    description: "Le paramètre  écrit n'est présent dans la liste des valeurs acceptées"
  })
  @ApiUnauthorizedResponse({
    description: "Vous n'avez pas accès à cette route"
  })
  getDecisions(
    @Query(
      'status',
      new ParseEnumPipe(DecisionStatus, { errorHttpStatusCode: HttpStatus.BAD_REQUEST })
    )
    status: DecisionStatus,
    @Query('source', new ParseEnumPipe(Sources, { errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
    source: Sources,
    @Request() req
  ): GetDecisionListDTO[] {
    const authorizedApiKeys = [process.env.LABEL_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!new ApiKeyValidation().isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ForbiddenException()
    }
    this.logger.log('GET /decisions called with status ' + status)
    return new MockUtils().allDecisionsToBeTreated
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
  @ApiAcceptedResponse({ description: 'Décision créée' })
  @ApiBadRequestResponse({
    description: 'Il manque un ou plusieurs champs obligatoires dans la décision'
  })
  @ApiUnauthorizedResponse({
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
    if (!new ApiKeyValidation().isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ForbiddenException()
    }

    const createDecisionUsecase = new CreateDecisionUsecase(this.mongoRepository)
    const decisionCreated = await createDecisionUsecase.execute(decision)
    return {
      id: decisionCreated.id,
      message: 'Decision créée'
    }
  }
}
