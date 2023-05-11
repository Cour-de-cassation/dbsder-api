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
    if (apikey !== process.env.LABEL_API_KEY && apikey !== process.env.NORMALIZATION_API_KEY) {
      this.logger.error('[AUTH] Invalid API Key')
      return false
    }
    return true
  }

  handleApiKey(apiKey: string, method: string, path: string): string {
    if (method == 'GET' && path == '/decisions' && apiKey == process.env.LABEL_API_KEY) {
      return 'ok'
    }
    if (method == 'POST' && path == '/decisions' && apiKey == process.env.NORMALIZATION_API_KEY) {
      return 'ok'
    }
    return 'error'
  }
}
