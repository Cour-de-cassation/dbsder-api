import { GetDecisionsListResponse } from '../controllers/responses/getDecisionsList.response'
import { UpdateDecisionRapportsOccultationsDTO } from '../dto/updateDecision.dto'
import { LabelStatus, Sources } from 'dbsder-api-types'
import { DecisionModel } from '../db/models/decision.model'

export class MockUtils {
  decisionCCToBeTreated: GetDecisionsListResponse = {
    dateCreation: '2023-04-11',
    _id: 'id2023',
    source: Sources.CC,
    status: LabelStatus.TOBETREATED
  }

  decisionCAToBeTreated: GetDecisionsListResponse = {
    dateCreation: '2023-04-11',
    _id: 'id2023',
    source: Sources.CA,
    status: LabelStatus.TOBETREATED
  }

  decisionTJToBeTreated: GetDecisionsListResponse = {
    dateCreation: '2023-10-10T23:00Z',
    _id: 'id2023',
    source: Sources.TJ,
    status: LabelStatus.TOBETREATED
  }

  allDecisionsToBeTreated = [
    this.decisionCCToBeTreated,
    this.decisionTJToBeTreated,
    this.decisionCAToBeTreated
  ]

  decisionQueryDTO = {
    status: LabelStatus.TOBETREATED,
    source: Sources.TJ,
    startDate: '2023-10-09',
    endDate: '2023-10-11'
  }
  decisionQueryByNumberDTO = {
    numero: '01/12345'
  }

  decisionQueryWithUnknownSourceDTO = {
    status: LabelStatus.TOBETREATED,
    source: 'unknownSource',
    startDate: '2023-10-10',
    endDate: '2023-10-11'
  }

  decisionQueryWithUnknownNumberDTO = {
    number: 'unknownNumber'
  }

  createDecisionDTO = {
    _id: 'someID',
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
    labelStatus: LabelStatus.TOBETREATED,
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

  decisionModel: DecisionModel = {
    codeDecision: '',
    codeNature: '',
    codeService: '',
    debatPublic: false,
    decisionAssociee: undefined,
    libelleCodeDecision: '',
    libelleNAC: '',
    libelleNatureParticuliere: '',
    libelleService: '',
    matiereDeterminee: false,
    numeroRoleGeneral: '01/12345',
    pourvoiCourDeCassation: false,
    pourvoiLocal: false,
    recommandationOccultation: undefined,
    selection: false,
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
    _id: 'id2023',
    jurisdictionCode: 'someJurisdictionCode',
    jurisdictionId: 'someJurisdictionId',
    jurisdictionName: 'someJurisdictionName',
    labelStatus: LabelStatus.TOBETREATED,
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

  decisionRapportsOccultations: UpdateDecisionRapportsOccultationsDTO = {
    rapportsOccultations: [
      {
        annotations: [
          {
            category: 'some-category',
            entityId: 'some-entity-id',
            start: 1,
            text: 'some-text',
            certaintyScore: 80
          }
        ],
        source: 'some-source',
        order: 1
      }
    ]
  }

  decisionPseudonymisee = {
    codeDecision: '',
    codeNature: '',
    codeService: '',
    debatPublic: false,
    decisionAssociee: undefined,
    libelleCodeDecision: '',
    libelleNAC: '',
    libelleNatureParticuliere: '',
    libelleService: '',
    matiereDeterminee: false,
    numeroRoleGeneral: '01/12345',
    pourvoiCourDeCassation: false,
    pourvoiLocal: false,
    recommandationOccultation: undefined,
    selection: false,
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
    _id: 'id2023',
    jurisdictionCode: 'someJurisdictionCode',
    jurisdictionId: 'someJurisdictionId',
    jurisdictionName: 'someJurisdictionName',
    labelStatus: LabelStatus.TOBETREATED,
    natureAffaireCivil: 'someNatureAffaireCivil',
    natureAffairePenal: 'someNatureAffairePenal',
    occultation: {
      additionalTerms: 'someAdditionalTerms',
      categoriesToOmit: ['someCategoriesToOmit']
    },
    publication: ['somePublication'],
    registerNumber: 'someRegisterNumber',
    solution: 'someSolution',
    sourceId: 1,
    sourceName: Sources.TJ
  }

  createDecisionTJDto = {
    ...this.createDecisionDTO,
    codeService: '0A',
    libelleNAC: 'Demande en dommages-intérêts contre un organisme',
    numeroRoleGeneral: '01/12345',
    libelleService: 'Libelle de service',
    codeDecision: '0aA',
    libelleCodeDecision: 'some libelle code decision',
    codeNature: '6C',
    libelleNatureParticuliere: 'Autres demandes en matière de frais et dépens',
    recommandationOccultation: 'aucune',
    selection: false,
    matiereDeterminee: true,
    pourvoiLocal: false,
    pourvoiCourDeCassation: false,
    debatPublic: true,
    indicateurQPC: true
  }

  decisionAssociee = {
    numeroRegistre: 'A',
    numeroRoleGeneral: '01/12345',
    idJuridiction: 'TJ00000',
    date: '20221121'
  }

  presidentDtoMock = {
    fonction: 'president',
    nom: 'Nom Presidente',
    prenom: 'Prenom Presidente',
    civilite: 'Mme.'
  }
}
