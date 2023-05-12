import { IsString } from 'class-validator'
import { DecisionStatus } from './enum'

export class CreateDecisionDTO {
  @IsString()
  id: string

  // analysis: {
  //   analyse: string[]
  //   doctrine: string
  //   link: string
  //   reference: string[]
  //   source: string
  //   summary: string
  //   target: string
  //   title: string[]
  // }
  // appeals: string[]
  // chamberId: string
  // chamberName: string
  // iddecision: string
  // dateCreation: string
  // dateDecision: string
  // decatt: number[]
  // jurisdictionCode: string
  // jurisdictionId: string
  // jurisdictionName: string
  // labelStatus: DecisionStatus
  // occultation: {
  //   additionalTerms: string
  //   categoriesToOmit: string[]
  // }
  // originalText: string
  // pseudoStatus?: string
  // pseudoText?: string
  // public?: boolean | null
  // registerNumber: string
  // solution: string
  // sourceId: number
  // sourceName: string
  // zoning?: object
  // publication: string[]
  // formation: string
  // blocOccultation: number
  // NAOCode: string
  // natureAffaireCivil: string
  // natureAffairePenal: string
  // codeMatiereCivil: string
}
