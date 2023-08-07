import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { HeaderAPIKeyStrategy } from 'passport-headerapikey'
import { CustomLogger } from '../utils/customLogger.utils'

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  private readonly logger = new CustomLogger()

  constructor() {
    super({ header: 'x-api-key', prefix: '' }, true, (apikey, done) => {
      return done(this.isApiKeyValid(apikey))
    })
  }

  isApiKeyValid(apikey: string): boolean {
    const validApiKeys = [
      process.env.LABEL_API_KEY,
      process.env.NORMALIZATION_API_KEY,
      process.env.OPENSDER_API_KEY,
      process.env.OPS_API_KEY,
      process.env.PUBLICATION_API_KEY
    ]
    if (!validApiKeys.includes(apikey)) {
      this.logger.error({ message: '[AUTH] Invalid API Key', operationName: 'isApiKeyValid' })
      return false
    }
    return true
  }
}
