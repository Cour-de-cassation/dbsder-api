import { GetDecisionListDTO } from '../../domain/getDecisionList.dto'
import { DecisionStatus } from '../../domain/enum'

export class MockUtils {
  decisionCCToBeTreated: GetDecisionListDTO = {
    dateCreation: '2023-04-11',
    id: 'id2023',
    source: 'CC',
    status: DecisionStatus.TOBETREATED
  }

  decisionCAToBeTreated: GetDecisionListDTO = {
    dateCreation: '2023-04-11',
    id: 'id2023',
    source: 'CA',
    status: DecisionStatus.TOBETREATED
  }

  decisionTJToBeTreated: GetDecisionListDTO = {
    dateCreation: '2023-04-11',
    id: 'id2023',
    source: 'TJ',
    status: DecisionStatus.TOBETREATED
  }

  allDecisionsToBeTreated = [
    this.decisionCCToBeTreated,
    this.decisionTJToBeTreated,
    this.decisionCAToBeTreated
  ]

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
    iddecision: 'someIddecision',
    dateCreation: 'someDateCreation',
    dateDecision: 'someDateDecision',
    decatt: [1, 2],
    jurisdictionCode: 'someJurisdictionCode',
    jurisdictionId: 'someJurisdictionId',
    jurisdictionName: 'someJurisdictionName',
    labelStatus: DecisionStatus.TOBETREATED,
    occultation: {
      additionalTerms: 'someAdditionalTerms',
      categoriesToOmit: ['someCategoriesToOmit']
    },
    originalText: 'someOriginalText',
    registerNumber: 'someRegisterNumber',
    solution: 'someSolution',
    sourceId: 1,
    sourceName: 'someSourceName',
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
    dateCreation: 'someDateCreation',
    dateDecision: 'someDateDecision',
    decatt: [1, 2],
    formation: 'someFormation',
    id: 'someID',
    iddecision: 'someIddecision',
    jurisdictionCode: 'someJurisdictionCode',
    jurisdictionId: 'someJurisdictionId',
    jurisdictionName: 'someJurisdictionName',
    labelStatus: DecisionStatus.TOBETREATED,
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
    sourceName: 'someSourceName'
  }
}
