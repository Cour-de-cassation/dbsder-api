import { Controller, Get, HttpStatus, ParseEnumPipe, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { MockUtils } from '../utils/mock.utils'
import { DecisionDTO } from 'src/domain/decision.dto'
import { DecisionStatus } from '../../domain/enum'

@ApiTags('DbSder')
@Controller('decisions')
export class DecisionsController {
  @Get()
  getDecisions(
    @Query(
      'status',
      new ParseEnumPipe(DecisionStatus, { errorHttpStatusCode: HttpStatus.BAD_REQUEST })
    )
    status: DecisionStatus
  ): DecisionDTO[] {
    return new MockUtils().allDecisionsToBeTreated
  }
}
