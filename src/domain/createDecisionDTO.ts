import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'
import { DecisionStatus } from './enum'

export class CreateDecisionDTO {
  @IsString()
  id: string

  analysis: {
    analyse: string[]
    doctrine: string
    link: string
    reference: string[]
    source: string
    summary: string
    target: string
    title: string[]
  }

  @IsArray()
  appeals: string[]

  @IsString()
  chamberId: string

  @IsString()
  chamberName: string

  @IsString()
  iddecision: string

  @IsString()
  dateCreation: string

  @IsString()
  dateDecision: string

  @IsArray()
  decatt: number[]

  @IsString()
  jurisdictionCode: string

  @IsString()
  jurisdictionId: string

  @IsString()
  jurisdictionName: string

  // labelStatus: DecisionStatus
  // occultation: {
  //   additionalTerms: string
  //   categoriesToOmit: string[]
  // }
  @IsString()
  originalText: string

  @IsString()
  @IsOptional()
  pseudoStatus?: string

  @IsString()
  @IsOptional()
  pseudoText?: string

  // public?: boolean | null

  @IsString()
  registerNumber: string

  @IsString()
  solution: string

  @IsNumber()
  sourceId: number

  @IsString()
  sourceName: string

  // zoning?: object

  @IsArray()
  publication: string[]

  @IsString()
  formation: string

  @IsNumber()
  blocOccultation: number

  @IsString()
  NAOCode: string

  @IsString()
  natureAffaireCivil: string

  @IsString()
  natureAffairePenal: string

  @IsString()
  codeMatiereCivil: string
}
