import {
  DecisionAnalyse,
  DecisionAssociee,
  DecisionOccultation,
  LabelStatus,
  LabelTreatment,
  Occultation,
  PartieTJ,
  President,
  Sources
} from 'dbsder-api-types'

export class GetDecisionByIdResponse {
  _id: string
  analysis?: DecisionAnalyse
  appeals: string[]
  chamberId: string
  chamberName: string
  dateCreation: string
  dateDecision: string
  decatt?: number[]
  jurisdictionCode: string
  jurisdictionId: string
  jurisdictionName: string
  labelStatus: LabelStatus
  occultation?: DecisionOccultation // champ non communiqué pour les décisions pseudonymisées
  originalText?: string // champ non communiqué pour les décisions pseudonymisées
  pseudoStatus?: string
  pseudoText?: string
  public?: boolean
  registerNumber: string
  solution?: string
  sourceId: number
  sourceName: Sources
  zoning?: object
  publication?: string[]
  formation?: string
  blocOccultation: number
  NAOCode?: string
  natureAffaireCivil?: string
  natureAffairePenal?: string
  codeMatiereCivil?: string
  NACCode?: string
  NPCode?: string
  endCaseCode?: string
  filenameSource?: string
  labelTreatments?: LabelTreatment[]
  parties?: PartieTJ[] | object
  pubCategory?: string
  codeDecision?: string
  codeNature?: string
  codeService?: string
  debatPublic?: boolean
  decisionAssociee?: DecisionAssociee
  indicateurQPC?: boolean
  idDecisionWinci?: string
  libelleCodeDecision?: string
  libelleNAC?: string
  libelleNatureParticuliere?: string
  libelleService?: string
  matiereDeterminee?: boolean
  numeroRoleGeneral?: string
  pourvoiCourDeCassation?: boolean
  pourvoiLocal?: boolean
  president?: President
  recommandationOccultation?: Occultation
  sommaire?: string
  selection?: boolean
}
