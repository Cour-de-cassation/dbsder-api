import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  validateApiKey(apikey: any): boolean {
    return true
  }
}
