import { Injectable, NestMiddleware } from '@nestjs/common'
import * as passport from 'passport'
import { ClientNotAuthorizedException } from '../../exceptions/clientNotAuthorized.exception'
import { CustomLogger } from '../../utils/customLogger.utils'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new CustomLogger()
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
          const error = new ClientNotAuthorizedException()
          this.logger.errorHttp(
            {
              operationName: 'callPassportAuthentication'
            },
            req,
            error.message
          )
          throw error
        }
      }
    )(req, res, next)
  }
}
