import { ConsoleLogger } from '@nestjs/common'
import pino from 'pino'
import { pinoConfig } from './pinoConfig.utils'

export class CustomLogger extends ConsoleLogger {
  private readonly date = '[' + new Date().toISOString() + ']'
  private readonly APP_NAME = 'DBSderApi'

  constructor() {
    super()
  }

  error(message: string, decisionId?: string): void {
    const prefix =
      '[ERROR]' + this.date + formatDecisionIdInLog(decisionId) + '[' + this.APP_NAME + ']'
    super.error(prefix + ' ' + message)
  }
  log(message: string, decisionId?: string): void {
    const prefix =
      '[LOG]' + this.date + formatDecisionIdInLog(decisionId) + '[' + this.APP_NAME + ']'
    super.log(prefix + ' ' + message)
  }
  warn(message: string, decisionId?: string): void {
    const prefix =
      '[WARN]' + this.date + formatDecisionIdInLog(decisionId) + '[' + this.APP_NAME + ']'
    super.warn(prefix + ' ' + message)
  }
}

function formatDecisionIdInLog(id?: string): string {
  return id ? '[' + id + ']' : ''
}

export class CustomLoggerV2 {
  private logger: pino.Logger
  constructor() {
    this.logger = pino(pinoConfig.pinoHttp)
  }

  log(data?: any, message?: string) {
    this.logger.info(data, message)
  }

  logApi(data: any, req, statusCode: number, message?: string) {
    this.logger.info(
      {
        data,
        httpMethod: req.method,
        path: req.url,
        statusCode: statusCode
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

  errorApi(data: any, req, statusCode: number, message?: string) {
    this.logger.error(
      {
        data,
        httpMethod: req.method,
        path: req.url,
        statusCode: statusCode
      },
      message
    )
  }
}
