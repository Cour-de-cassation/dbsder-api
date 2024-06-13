import { LabelStatus, PublishStatus } from 'dbsder-api-types'
import { LogsFormat } from '../../infrastructure/utils/logsFormat.utils'
import { CreateDecisionDTO } from '../../infrastructure/dto/createDecision.dto'
import { Logger } from '@nestjs/common'

const logger = new Logger()
const formatLogs: LogsFormat = {
  operationName: 'computePublishStatus',
  msg: `computePublishStatus is starting`
}

export function computePublishStatus(decisionDto: CreateDecisionDTO): PublishStatus {
  logger.log({ ...formatLogs })

  const publishStatus =
    decisionDto.labelStatus === LabelStatus.TOBETREATED
      ? PublishStatus.TOBEPUBLISHED
      : PublishStatus.BLOCKED

  logger.log({ ...formatLogs, msg: `Setting publishStatus to ${publishStatus}` })

  return publishStatus
}
