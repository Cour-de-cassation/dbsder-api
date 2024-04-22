import { CodeNAC, LabelStatus } from 'dbsder-api-types'
import { LogsFormat } from '../../infrastructure/utils/logsFormat.utils'
import { CreateDecisionDTO } from '../../infrastructure/dto/createDecision.dto'
import { Logger } from '@nestjs/common'

const logger = new Logger()
const formatLogs: LogsFormat = {
  operationName: 'computeLabelStatus',
  msg: `computeLabelStatus is starting`
}

export function computeLabelStatus(
  decisionDto: CreateDecisionDTO,
  detailsNAC: CodeNAC
): LabelStatus {
  logger.log({ ...formatLogs })

  if (detailsNAC == null) {
    logger.warn({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because its codeNAC ${decisionDto.NACCode} is unknown, changing LabelStatus to ${LabelStatus.IGNORED_CODE_NAC_INCONNU}.`
    })
    return LabelStatus.IGNORED_CODE_NAC_INCONNU
  }

  if (detailsNAC.categoriesToOmitTJ == null || detailsNAC.blocOccultationTJ === 0) {
    logger.warn({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because its codeNACC ${decisionDto.NACCode} is obsolete, changing LabelStatus to ${LabelStatus.IGNORED_CODE_NAC_OBSOLETE}.`
    })
    return LabelStatus.IGNORED_CODE_NAC_OBSOLETE
  }

  if (decisionDto.public === false) {
    logger.warn({
      ...formatLogs,
      msg: `Decision is not public, changing LabelStatus to ${LabelStatus.IGNORED_DECISION_NON_PUBLIQUE}.`
    })
    return LabelStatus.IGNORED_DECISION_NON_PUBLIQUE
  }

  if (detailsNAC.indicateurDecisionRenduePubliquement === false) {
    logger.warn({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because NACCode ${decisionDto.NACCode} indicates that the decision can not be public, changing LabelStatus to ${LabelStatus.IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE}.`
    })
    return LabelStatus.IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE
  }

  if (decisionDto.originalTextZoning?.is_public === 0) {
    logger.warn({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because zoning indicates that the decision can not be public, changing LabelStatus to ${LabelStatus.IGNORED_DECISION_NON_PUBLIQUE_PAR_ZONAGE}.`
    })
    return LabelStatus.IGNORED_DECISION_NON_PUBLIQUE_PAR_ZONAGE
  }

  if (decisionDto?.debatPublic === true) {
    if (!detailsNAC.indicateurDebatsPublics) {
      logger.warn({
        ...formatLogs,
        msg: `Decision can not be treated by Judilibre because NACCode indicates that the decision is partially public, changing LabelStatus to ${LabelStatus.IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE}.`
      })
      return LabelStatus.IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE
    }

    if (decisionDto.originalTextZoning?.is_public === 2) {
      logger.warn({
        ...formatLogs,
        msg: `Decision can not be treated by Judilibre because zoning indicates that the decision is partially public, changing LabelStatus to ${LabelStatus.IGNORED_DECISION_PARTIELLEMENT_PUBLIQUE_PAR_ZONAGE}.`
      })
      return LabelStatus.IGNORED_DECISION_PARTIELLEMENT_PUBLIQUE_PAR_ZONAGE
    }
  }

  return decisionDto.labelStatus
}
