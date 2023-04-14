import { Controller, Get } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'

@Controller('')
@ApiExcludeController()
export class RedirectController {
  @Get()
  redirect(): string {
    return null
  }
}
