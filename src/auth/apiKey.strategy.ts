import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { HeaderAPIKeyStrategy } from 'passport-headerapikey'

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor() {
    super({ header: 'x-api-key', prefix: '' }, true, (apikey, done, req) => {
      const checkKey = this.validateApiKey(apikey, req.method)
      if (!checkKey) {
        return done(false)
      }
      return done(true)
    })
  }
  validateApiKey(apikey: string, verbMethod: string): boolean {
    const readApiKey = process.env.READ_API_KEY || 'e4f747f0-35f0-4127-b415-9a39f7537cc8'
    if (apikey === readApiKey && verbMethod == 'GET') {
      return true
    }
    return false
  }
}
