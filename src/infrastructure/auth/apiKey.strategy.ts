import { Injectable, Logger } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { HeaderAPIKeyStrategy } from 'passport-headerapikey'

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  private readonly logger = new Logger()

  constructor() {
    super({ header: 'x-api-key', prefix: '' }, true, (apikey, done) => {
      return done(this.isApiKeyValid(apikey))
    })
  }

  isApiKeyValid(apikey: string): boolean {
    if (apikey !== process.env.LABEL_API_KEY) {
      this.logger.error('[AUTH] Invalid API Key')
      return false
    }
    return true
  }
}
