import pino from 'pino'
import { pinoConfig } from './pinoConfig.utils'

export class CustomLogger {
  private logger: pino.Logger
  constructor(appName?: string) {
    this.logger = pino({
      ...pinoConfig.pinoHttp,
      base: { appName: appName ? appName : 'DBSderApi' }
    })
  }

  log(data?: any, message?: string) {
    this.logger.info({ data }, message)
  }

  logHttp(data: any, req, message?: string) {
    this.logger.info(
      {
        data,
        httpMethod: req.method,
        path: req.url
      },
      message
    )
  }

  error(data?: any, message?: string) {
    this.logger.error(
      {
        data
      },
      message
    )
  }

  errorHttp(data: any, req, message?: string) {
    this.logger.error(
      {
        data,
        httpMethod: req.method,
        path: req.url
      },
      message
    )
  }
}
