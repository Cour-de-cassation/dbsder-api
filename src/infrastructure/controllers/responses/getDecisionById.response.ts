import {
  DecisionAnalyse,
  DecisionOccultation
} from '../../../infrastructure/dto/createDecision.dto'
import { DecisionStatus } from '../../../domain/enum'

export class GetDecisionByIdResponse {
  id: string

  analysis: DecisionAnalyse

  appeals: string[]

  chamberId: string

  chamberName: string

  iddecision: string

  dateCreation: string

  dateDecision: string

  decatt: number[]

  jurisdictionCode: string

  jurisdictionId: string

  jurisdictionName: string

  labelStatus: DecisionStatus

  occultation: DecisionOccultation

  originalText: string

  pseudoStatus?: string

  pseudoText?: string

  public?: boolean

  registerNumber: string

  solution: string

  sourceId: number

  sourceName: string

  zoning?: object

  publication: string[]

  formation: string

  blocOccultation: number

  NAOCode: string

  natureAffaireCivil: string

  natureAffairePenal: string

  codeMatiereCivil: string
}
