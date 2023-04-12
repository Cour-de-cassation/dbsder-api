import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { MockUtils } from '../utils/mock.utils'
import { DecisionDTO } from 'src/domain/decision.dto'

@ApiTags('DbSder')
@Controller('decisions')
export class DecisionsController {
  @Get('id')
  getDecisionsIds(): DecisionDTO[] {
    // Avec usecase ? ex : return getAllDecisionIdsUsecase.execute()
    return [new MockUtils().decision]
  }
}
