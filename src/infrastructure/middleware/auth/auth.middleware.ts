import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import * as passport from 'passport'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  EXCEPTION_PATHS = ['/doc', '/']
  use(req: any, res: any, next: () => void) {
    if (this.EXCEPTION_PATHS.includes(req.path)) {
      next()
    } else {
      this.callPassportAuthentication(req, res, next)
    }
  }

  callPassportAuthentication(req: any, res: any, next: () => void) {
    passport.authenticate(
      'headerapikey',
      { session: false, failureRedirect: '/api/unauthorized' },
      (value) => {
        if (value) {
          next()
        } else {
          throw new UnauthorizedException()
        }
      }
    )(req, res, next)
  }
}
