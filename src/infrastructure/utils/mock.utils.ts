import { DecisionStatus, Sources } from '../../domain/enum'
import { GetDecisionsListResponse } from '../controllers/responses/getDecisionsListResponse'

export class MockUtils {
  decisionCCToBeTreated: GetDecisionsListResponse = {
    dateCreation: '2023-04-11',
    id: 'id2023',
    source: Sources.CC,
    status: DecisionStatus.TO_BE_TREATED
  }

  decisionCAToBeTreated: GetDecisionsListResponse = {
    dateCreation: '2023-04-11',
    id: 'id2023',
    source: Sources.CA,
    status: DecisionStatus.TO_BE_TREATED
  }

  decisionTJToBeTreated: GetDecisionsListResponse = {
    dateCreation: '2023-10-10T23:00Z',
    id: 'id2023',
    source: Sources.TJ,
    status: DecisionStatus.TO_BE_TREATED
  }

  allDecisionsToBeTreated = [
    this.decisionCCToBeTreated,
    this.decisionTJToBeTreated,
    this.decisionCAToBeTreated
  ]

  decisionQueryDTO = {
    status: DecisionStatus.TO_BE_TREATED,
    source: Sources.TJ,
    startDate: '2023-10-09',
    endDate: '2023-10-11'
  }

  decisionQueryWithUnknownSourceDTO = {
    status: DecisionStatus.TO_BE_TREATED,
    source: 'unknownSource',
    startDate: '2023-10-10',
    endDate: '2023-10-11'
  }

  createDecisionDTO = {
    id: 'someID',
    analysis: {
      analyse: ['someAnalyse'],
      doctrine: 'someDoctrine',
      link: 'someLink',
      reference: ['someReference'],
      source: 'someSource',
      summary: 'someSummary',
      target: 'someTarget',
      title: ['someTitle']
    },
    appeals: ['someAppeal'],
    chamberId: 'someChamberId',
    chamberName: 'someChamberName',
    dateCreation: 'someDateCreation',
    dateDecision: 'someDateDecision',
    decatt: [1, 2],
    jurisdictionCode: 'someJurisdictionCode',
    jurisdictionId: 'someJurisdictionId',
    jurisdictionName: 'someJurisdictionName',
    labelStatus: DecisionStatus.TO_BE_TREATED,
    occultation: {
      additionalTerms: 'someAdditionalTerms',
      categoriesToOmit: ['someCategoriesToOmit']
    },
    originalText: 'someOriginalText',
    registerNumber: 'someRegisterNumber',
    solution: 'someSolution',
    sourceId: 1,
    sourceName: Sources.TJ,
    publication: ['somePublication'],
    formation: 'someFormation',
    blocOccultation: 1,
    NAOCode: 'someNAOCode',
    natureAffaireCivil: 'someNatureAffaireCivil',
    natureAffairePenal: 'someNatureAffairePenal',
    codeMatiereCivil: 'someCodeMatiereCivil'
  }

  decisionModel = {
    NAOCode: 'someNAOCode',
    analysis: {
      analyse: ['someAnalyse'],
      doctrine: 'someDoctrine',
      link: 'someLink',
      reference: ['someReference'],
      source: 'someSource',
      summary: 'someSummary',
      target: 'someTarget',
      title: ['someTitle']
    },
    appeals: ['someAppeal'],
    blocOccultation: 1,
    chamberId: 'someChamberId',
    chamberName: 'someChamberName',
    codeMatiereCivil: 'someCodeMatiereCivil',
    dateCreation: '2023-10-10T23:00Z',
    dateDecision: 'someDateDecision',
    decatt: [1, 2],
    formation: 'someFormation',
    id: 'id2023',
    jurisdictionCode: 'someJurisdictionCode',
    jurisdictionId: 'someJurisdictionId',
    jurisdictionName: 'someJurisdictionName',
    labelStatus: DecisionStatus.TO_BE_TREATED,
    natureAffaireCivil: 'someNatureAffaireCivil',
    natureAffairePenal: 'someNatureAffairePenal',
    occultation: {
      additionalTerms: 'someAdditionalTerms',
      categoriesToOmit: ['someCategoriesToOmit']
    },
    originalText: 'someOriginalText',
    publication: ['somePublication'],
    registerNumber: 'someRegisterNumber',
    solution: 'someSolution',
    sourceId: 1,
    sourceName: Sources.TJ
  }
}
