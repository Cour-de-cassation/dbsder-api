/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, HttpStatus, Logger, ParseEnumPipe, Query } from '@nestjs/common'
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiServiceUnavailableResponse,
  ApiTags
} from '@nestjs/swagger'
import { MockUtils } from '../utils/mock.utils'
import { DecisionDTO } from 'src/domain/decision.dto'
import { DecisionStatus } from '../../domain/enum'

@ApiTags('DbSder')
@Controller('decisions')
export class DecisionsController {
  private readonly logger = new Logger()

  @Get()
  @ApiConsumes('application/json')
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
    status: DecisionStatus
  ): DecisionDTO[] {
    this.logger.log('GET /decisions called with status ' + status)
    return new MockUtils().allDecisionsToBeTreated
  }
}
