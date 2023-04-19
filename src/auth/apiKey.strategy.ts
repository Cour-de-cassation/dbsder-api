import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { HeaderAPIKeyStrategy } from 'passport-headerapikey'

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor() {
    super({ header: 'x-api-key', prefix: '' }, true, (apikey, done, req) => {
      const checkKey = this.validateApiKey(apikey)
      if (!checkKey) {
        return done(false)
      }
      return done(true)
    })
  }
  validateApiKey(apikey: string): boolean {
    if (apikey === process.env.LABEL_API_KEY) {
      return true
    }
    return false
  }
}
