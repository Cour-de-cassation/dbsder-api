import { LogsFormat } from '../../infrastructure/utils/logsFormat.utils'
import { CreateDecisionDTO } from '../../infrastructure/dto/createDecision.dto'
import { Logger } from '@nestjs/common'
import { Decision } from 'src/infrastructure/db/models/decision.model'

const logger = new Logger()
const formatLogs: LogsFormat = {
  operationName: 'isDecisionHasSensitiveChanges',
  msg: `isDecisionHasSensitiveChanges is starting`
}

export function isDecisionHasSensitiveChanges(
  currentDecision: Decision,
  newDecision: CreateDecisionDTO
): boolean {
  logger.log({ ...formatLogs })

  if (currentDecision.originalText != newDecision.originalText) {
    logger.log({
      ...formatLogs,
      msg: `Decision ${newDecision.sourceName}:${newDecision.sourceId} has a sensitive change on originalText.`
    })
    return true
  }
  if (currentDecision.occultation != newDecision.occultation) {
    logger.log({
      ...formatLogs,
      msg: `Decision ${newDecision.sourceName}:${newDecision.sourceId} has a sensitive change on occultation.`
    })
    return true
  }

  return false
}
