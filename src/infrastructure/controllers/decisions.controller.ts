/* eslint-disable @typescript-eslint/no-unused-vars */
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
  ApiHeader,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'
import { MockUtils } from '../utils/mock.utils'
import { GetDecisionListDTO } from '../../domain/getDecisionList.dto'
import { DecisionStatus } from '../../domain/enum'
import { CreateDecisionDTO } from '../../domain/createDecisionDTO'
import { ValidateDtoPipe } from '../pipes/validateDto.pipe'
import { CreateDecisionUsecase } from '../../domain/usecase/createDecision.usecase'

@ApiTags('DbSder')
@Controller('decisions')
export class DecisionsController {
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
  @ApiAcceptedResponse({ description: 'Une liste de décisions' })
  @ApiBadRequestResponse({
    description: "Le paramètre  écrit n'est présent dans la liste des valeurs acceptées"
  })
  getDecisions(
    @Query(
      'status',
      new ParseEnumPipe(DecisionStatus, { errorHttpStatusCode: HttpStatus.BAD_REQUEST })
    )
    status: DecisionStatus,
    @Request() req
  ): GetDecisionListDTO[] {
    const apiKey = req.headers['x-api-key']
    if (apiKey !== process.env.LABEL_API_KEY) {
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
  @ApiQuery({
    name: 'decision',
    description: 'Décision intègre au format wordperfect et metadonnées associées.'
  })
  @ApiAcceptedResponse({ description: 'Decision créée' })
  @ApiBadRequestResponse({
    description: 'Il manque un ou plusieurs champs obligatoires pour la décision'
  })
  @UsePipes()
  createDecisions(
    @Request() req,
    @Body('decision', new ValidateDtoPipe()) decision: CreateDecisionDTO
  ) {
    const apiKey = req.headers['x-api-key']
    if (apiKey !== process.env.NORMALIZATION_API_KEY) {
      throw new ForbiddenException()
    }

    const createDecisionUsecase = new CreateDecisionUsecase()
    createDecisionUsecase.execute(decision)
    return {
      message: 'Decision créée'
    }
  }
}
