import { CodeNAC, LabelStatus } from 'dbsder-api-types'
import { LogsFormat } from './logsFormat.utils'
import { codeDecisionListTransmissibleToCC } from '../filterLists/codeDecisionList'
import { authorizedCharacters } from '../filterLists/authorizedCharactersList'
import { CreateDecisionDTO } from '../dto/createDecision.dto'
import { Logger } from '@nestjs/common'
const dateMiseEnService = getMiseEnServiceDate()
const authorizedCharactersdSet = new Set(authorizedCharacters)
const logger = new Logger()
const formatLogs: LogsFormat = {
  operationName: 'computeLabelStatus',
  msg: `computeLabelStatus is starting`
}

export function computeLabelStatus(decisionDto: CreateDecisionDTO, source?: string, detailsNAC?: CodeNAC): LabelStatus {
  logger.log({ ...formatLogs})
  
  const dateCreation = new Date(decisionDto.dateCreation)
  const dateDecision = new Date(decisionDto.dateDecision)

//dateDecision est dans l'avenir
  if (isDecisionInTheFuture(dateCreation, dateDecision)) {
    logger.error({
      ...formatLogs,
      msg: `Incorrect date, dateDecision must be before dateCreation.. Changing LabelStatus to ${LabelStatus.IGNORED_DATE_DECISION_INCOHERENTE}.`
    })
    return LabelStatus.IGNORED_DATE_DECISION_INCOHERENTE
  }

//dateDecision est plus de six mois avant aujourd'hui
  if (isDecisionOlderThanSixMonths(dateCreation, dateDecision)) {
    logger.error({
      ...formatLogs,
      msg: `Incorrect date, dateDecision must be less than 6 months old. Changing LabelStatus to ${LabelStatus.IGNORED_DATE_DECISION_INCOHERENTE}.`
    })
    return LabelStatus.IGNORED_DATE_DECISION_INCOHERENTE
  }

//dateDecision est avant le 15/12/2023 date de mise en service
  if (isDecisionOlderThanMiseEnService(dateDecision)) {
    logger.error({
      ...formatLogs,
      msg: `Incorrect date, dateDecision must be after mise en service. Changing LabelStatus to ${LabelStatus.IGNORED_DATE_AVANT_MISE_EN_SERVICE}.`
    })
    return LabelStatus.IGNORED_DATE_AVANT_MISE_EN_SERVICE
  }

//codeDecision absent de la liste statique
  if (!isDecisionFromTJTransmissibleToCC(decisionDto.endCaseCode)) {
    logger.warn({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because codeDecision ${decisionDto.endCaseCode} is not in authorized codeDecision list, changing LabelStatus to ${LabelStatus.IGNORED_CODE_DECISION_BLOQUE_CC}.`
    })
    return LabelStatus.IGNORED_CODE_DECISION_BLOQUE_CC
  }

//texte contient des caractéres qui ne sont pas dans la liste des caractéres autorisées
  if (!decisionContainsOnlyAuthorizedCharacters(decisionDto.originalText)) {
    logger.warn({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because its text contains unknown characters, changing LabelStatus to ${LabelStatus.IGNORED_CARACTERE_INCONNU}.`
    })
    return LabelStatus.IGNORED_CARACTERE_INCONNU
  }

//codeNACC est absent dans la table des codeNACC
  if(isCodeNACCInconnu(detailsNAC, decisionDto.NACCode)){
    logger.warn({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because its codeNACC ${decisionDto.NACCode} is unknown, changing LabelStatus to ${LabelStatus.IGNORED_CODE_NAC_INCONNU}.`
    })
    return LabelStatus.IGNORED_CODE_NAC_INCONNU
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
  if (decisionDto.originalTextZoning?.is_public !== undefined && decisionDto.originalTextZoning?.is_public === 0) {
    logger.error({
      ...formatLogs,
      msg: `Decision is not public by zonage, changing LabelStatus to ${LabelStatus.IGNORED_DECISION_NON_PUBLIQUE}.`
    })
    return LabelStatus.IGNORED_DECISION_NON_PUBLIQUE_PAR_ZONAGE
  }

//debatPublic == false ==> TOBETREATED
  if(decisionDto.sourceName === "juritj") {
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
      msg: `Decision is not public, changing LabelStatus to ${LabelStatus.IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE_PAR_ZONAGE}.`
    })
    return LabelStatus.IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE_PAR_ZONAGE
  }

  return decisionDto.labelStatus
}


function isDecisionInTheFuture(dateCreation: Date, dateDecision: Date): boolean {
  return dateDecision > dateCreation
}

function isDecisionOlderThanSixMonths(dateCreation: Date, dateDecision: Date): boolean {
  const monthDecision = new Date(dateDecision.getFullYear(), dateDecision.getMonth()).toISOString()
  const sixMonthsBeforeMonthCreation = new Date(
    dateCreation.getFullYear(),
    dateCreation.getMonth() - 6
  ).toISOString()
  return monthDecision < sixMonthsBeforeMonthCreation
}

function isDecisionFromTJTransmissibleToCC(endCaseCode: string): boolean {
  return codeDecisionListTransmissibleToCC.includes(endCaseCode)
}

function isDecisionOlderThanMiseEnService(dateDecision: Date): boolean {
  return dateDecision < dateMiseEnService
}


function isDecisionNotPublic(detailsNAC: CodeNAC): boolean {
    if(detailsNAC && detailsNAC.indicateurDecisionRenduePubliquement === false){
      return true
    }

    if(detailsNAC && detailsNAC.indicateurDecisionRenduePubliquement === true){
      return false
    }

  return false;
}

function isDecisionPartiallyPublic(detailsNAC: CodeNAC): boolean {
    if(detailsNAC && detailsNAC.indicateurDebatsPublics === false){
        return true;
    }
    if(detailsNAC && detailsNAC.indicateurDebatsPublics === true){
      return false;
    }

  return false
}

function isCodeNACCInconnu(detailsNAC: CodeNAC, decisionNACC: string): boolean {
  if(detailsNAC && detailsNAC.codeNAC === decisionNACC){
    return false;
  }
  return true
}

function decisionContainsOnlyAuthorizedCharacters(originalText: string): boolean {
  for (let i = 0; i < originalText.length; i++) {
    if (!authorizedCharactersdSet.has(originalText[i])) {
      // Character not found in authorizedSet
      return false
    }
  }
  return true
}

function getMiseEnServiceDate(): Date {
  if (!isNaN(new Date(process.env.COMMISSIONING_DATE).getTime())) {
    return new Date(process.env.COMMISSIONING_DATE)
  } else {
    return new Date('2023-12-15')
  }
}
