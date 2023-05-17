import { ConsoleLogger } from '@nestjs/common'

export class CustomLogger extends ConsoleLogger {
  private readonly date = '[' + new Date().toISOString() + ']'
  private appName: string

  constructor(appName: string) {
    super()
    this.appName = '[' + appName + ']'
  }

  error(message: string, decisionId?: string): void {
    const prefix = '[ERROR]' + this.date + formatDecisionIdInLog(decisionId) + this.appName
    super.error(prefix + ' ' + message)
  }
  log(message: string, decisionId?: string): void {
    const prefix = '[LOG]' + this.date + formatDecisionIdInLog(decisionId) + this.appName
    super.log(prefix + ' ' + message)
  }
  warn(message: string, decisionId?: string): void {
    const prefix = '[WARN]' + this.date + formatDecisionIdInLog(decisionId) + this.appName
    super.warn(prefix + ' ' + message)
  }
}

function formatDecisionIdInLog(id?: string): string {
  return id ? '[' + id + ']' : ''
}
