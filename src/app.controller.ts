import { Controller, Get, Redirect } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'

@Controller('')
@ApiExcludeController()
export class RedirectController {
  @Get()
  // TO DO : décommenter lorsque le swagger est initié
  // @Redirect('/doc')
  redirect(): string {
    return null
  }
}
