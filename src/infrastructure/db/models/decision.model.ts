import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { DecisionStatus } from '../../../domain/enum'
import { DecisionAnalyse, DecisionOccultation } from '../../../domain/createDecisionDTO'

@Schema()
export class DecisionModel {
  @Prop()
  id: string

  @Prop()
  analysis: DecisionAnalyse

  @Prop()
  appeals: string[]

  @Prop()
  chamberId: string

  @Prop()
  chamberName: string

  @Prop()
  iddecision: string

  @Prop()
  dateCreation: string

  @Prop()
  dateDecision: string

  @Prop()
  decatt: number[]

  @Prop()
  jurisdictionCode: string

  @Prop()
  jurisdictionId: string

  @Prop()
  jurisdictionName: string

  @Prop()
  labelStatus: DecisionStatus

  @Prop()
  occultation: DecisionOccultation

  @Prop()
  originalText: string

  @Prop()
  pseudoStatus?: string

  @Prop()
  pseudoText?: string

  @Prop()
  public?: boolean

  @Prop()
  registerNumber: string

  @Prop()
  solution: string

  @Prop()
  sourceId: number

  @Prop()
  sourceName: string

  @Prop(
    raw({
      zoning: { type: Object }
    })
  )
  zoning?: object

  @Prop()
  publication: string[]

  @Prop()
  formation: string

  @Prop()
  blocOccultation: number

  @Prop()
  NAOCode: string

  @Prop()
  natureAffaireCivil: string

  @Prop()
  natureAffairePenal: string

  @Prop()
  codeMatiereCivil: string
}
export const DecisionSchema = SchemaFactory.createForClass(DecisionModel)