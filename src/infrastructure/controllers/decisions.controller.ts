import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Collect')
@Controller('decisions')
export class DecisionsController {
  @Get()
  getDecisions() {
    return true
  }
}
