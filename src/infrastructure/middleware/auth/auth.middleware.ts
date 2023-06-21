import { Injectable, NestMiddleware } from '@nestjs/common'
import * as passport from 'passport'
import { ClientNotAuthorized } from '../../exceptions/clientNotAuthorized.exception'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  EXCEPTION_PATHS = ['/doc', '/', '/doc-json']
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
          throw new ClientNotAuthorized()
        }
      }
    )(req, res, next)
  }
}
