import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'
import { DecisionStatus } from './enum'
import { Type } from 'class-transformer'

export class DecisionOccultation {
  @IsString()
  additionalTerms: string

  @IsString({ each: true })
  categoriesToOmit: string[]
}

export class DecisionAnalyse {
  @IsString({ each: true })
  analyse: string[]

  @IsString()
  doctrine: string

  @IsString()
  link: string

  @IsString({ each: true })
  reference: string[]

  @IsString()
  source: string

  @IsString()
  summary: string

  @IsString()
  target: string

  @IsString({ each: true })
  title: string[]
}

export class CreateDecisionDTO {
  @IsString()
  id: string

  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => DecisionAnalyse)
  analysis: DecisionAnalyse

  @IsString({ each: true })
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

  @IsNumber({}, { each: true })
  decatt: number[]

  @IsString()
  jurisdictionCode: string

  @IsString()
  jurisdictionId: string

  @IsString()
  jurisdictionName: string

  @IsEnum(DecisionStatus)
  labelStatus: DecisionStatus

  @ValidateNested()
  @Type(() => DecisionOccultation)
  occultation: {
    additionalTerms: string
    categoriesToOmit: string[]
  }

  @IsString()
  originalText: string

  @IsString()
  @IsOptional()
  pseudoStatus?: string

  @IsString()
  @IsOptional()
  pseudoText?: string

  @IsBoolean()
  @IsOptional()
  public?: boolean

  @IsString()
  registerNumber: string

  @IsString()
  solution: string

  @IsNumber()
  sourceId: number

  @IsString()
  sourceName: string

  @IsObject()
  @IsOptional()
  zoning?: object

  @IsString({ each: true })
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
