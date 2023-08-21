import * as passport from 'passport'
import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { ClientNotAuthorizedException } from '../../exceptions/clientNotAuthorized.exception'
import { LogsFormat } from 'src/infrastructure/utils/logsFormat.utils'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger()
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
          const logsFormat: LogsFormat = {
            operationName: 'callPassportAuthentication',
            httpMethod: req.method,
            path: req.path,
            msg: error.message,
            statusCode: error.getStatus()
          }
          this.logger.error(logsFormat)

          throw error
        }
      }
    )(req, res, next)
  }
}
