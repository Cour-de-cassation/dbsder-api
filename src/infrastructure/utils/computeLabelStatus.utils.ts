import { CodeNAC, LabelStatus } from 'dbsder-api-types'
import { LogsFormat } from './logsFormat.utils'
import { CreateDecisionDTO } from '../dto/createDecision.dto'
import { Logger } from '@nestjs/common'


const logger = new Logger()
const formatLogs: LogsFormat = {
  operationName: 'computeLabelStatus',
  msg: `computeLabelStatus is starting`
}

export function computeLabelStatus(
  decisionDto: CreateDecisionDTO,
  source?: string,
  detailsNAC?: CodeNAC
): LabelStatus {
  
  logger.log({ ...formatLogs })
  //codeNACC est absent dans la table des codeNACC
  if (isCodeNACCInconnu(detailsNAC, decisionDto.NACCode)) {
    logger.warn({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because its codeNACC ${decisionDto.NACCode} is unknown, changing LabelStatus to ${LabelStatus.IGNORED_CODE_NAC_INCONNU}.`
    })
    return LabelStatus.IGNORED_CODE_NAC_INCONNU
  }

  //codeNACC est obsolete 
  if (isCodeNACCObsolete(detailsNAC)) {
    logger.warn({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because its codeNACC ${decisionDto.NACCode} is obsolete, changing LabelStatus to ${LabelStatus.IGNORED_CODE_NAC_OBSOLETE}.`
    })
    return LabelStatus.IGNORED_CODE_NAC_OBSOLETE
  }

  // public === false
  if (decisionDto.public === false) {
    logger.error({
      ...formatLogs,
      msg: `Decision is not public, changing LabelStatus to ${LabelStatus.IGNORED_DECISION_NON_PUBLIQUE}.`
    })
    return LabelStatus.IGNORED_DECISION_NON_PUBLIQUE
  }

  //tableNACCIndicateurDecisionPublique === false
  if (isDecisionNotPublic(detailsNAC)) {
    logger.warn({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because NACCode ${decisionDto.NACCode} indicates that the decision can not be public, changing LabelStatus to ${LabelStatus.IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE}.`
    })
    return LabelStatus.IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE
  }

  // zonage.is_public == 0
  if (
    decisionDto.originalTextZoning?.is_public !== undefined &&
    decisionDto.originalTextZoning?.is_public === 0
  ) {
    logger.error({
      ...formatLogs,
      msg: `Decision is not public by zonage, changing LabelStatus to ${LabelStatus.IGNORED_DECISION_NON_PUBLIQUE}.`
    })
    return LabelStatus.IGNORED_DECISION_NON_PUBLIQUE_PAR_ZONAGE
  }

  //debatPublic == false ==> TOBETREATED
  if (decisionDto.sourceName === 'juritj') {
    if (decisionDto?.debatPublic === false) {
      logger.error({
        ...formatLogs,
        msg: `Decision debat is not public, changing LabelStatus to ${LabelStatus.TOBETREATED}.`
      })
      return LabelStatus.TOBETREATED
    }
  }

  //tableNACCIndicateurDebatsPublics === false
  if (isDecisionPartiallyPublic(detailsNAC)) {
    logger.warn({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because NACCode indicates that the decision is partially public, changing LabelStatus to ${LabelStatus.IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE}.`
    })
    return LabelStatus.IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE
  }

  //zonage_is_public === 2
  if (decisionDto.originalTextZoning?.is_public === 2) {
    logger.error({
      ...formatLogs,
      msg: `Decision is not public, changing LabelStatus to ${LabelStatus.IGNORED_DECISION_PARTIELLEMENT_PUBLIQUE_PAR_ZONAGE}.`
    })
    return LabelStatus.IGNORED_DECISION_PARTIELLEMENT_PUBLIQUE_PAR_ZONAGE
  }

  return decisionDto.labelStatus
}

function isDecisionNotPublic(detailsNAC: CodeNAC): boolean {
  if (detailsNAC && detailsNAC.indicateurDecisionRenduePubliquement === false) {
    return true
  }

  if (detailsNAC && detailsNAC.indicateurDecisionRenduePubliquement === true) {
    return false
  }

  return false
}

function isDecisionPartiallyPublic(detailsNAC: CodeNAC): boolean {
  if (detailsNAC && detailsNAC.indicateurDebatsPublics === false) {
    return true
  }
  if (detailsNAC && detailsNAC.indicateurDebatsPublics === true) {
    return false
  }

  return false
}

function isCodeNACCInconnu(detailsNAC: CodeNAC, decisionNACC: string): boolean {
  if (decisionNACC && detailsNAC !== null && detailsNAC?.codeNAC === decisionNACC) {
    return false
  }
  return true
}

function isCodeNACCObsolete(detailsNAC: CodeNAC): boolean {
  if (detailsNAC.categoriesToOmitTJ !== null && detailsNAC.blocOccultationTJ !== 0) {
    return false
  }
  return true
}