import { ApiHeader } from '@nestjs/swagger'
import { Controller, Get, Request } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MongooseHealthIndicator
} from '@nestjs/terminus'
import { ApiKeyValidation } from '../../auth/apiKeyValidation'
import { ClientNotAuthorizedException } from '../../exceptions/clientNotAuthorized.exception'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator
  ) {}

  @Get()
  @ApiHeader({
    name: 'x-api-key',
    description: 'Clé API'
  })
  @HealthCheck()
  async check(@Request() req): Promise<HealthCheckResult> {
    const authorizedApiKeys = [process.env.OPS_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ClientNotAuthorizedException()
    }

    return this.health.check([async () => this.mongoose.pingCheck('mongoose')])
  }
}
