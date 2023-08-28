import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import {
  DecisionAnalyse,
  LabelStatus,
  DecisionOccultation,
  labelTreatmentsType,
  Sources
} from 'dbsder-api-types'

@Schema()
export class DecisionModel {
  @Prop()
  _id: string

  @Prop({ type: Object })
  analysis: DecisionAnalyse

  @Prop()
  appeals: string[]

  @Prop()
  chamberId: string

  @Prop()
  chamberName: string

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
  labelStatus: LabelStatus

  @Prop({ type: Object })
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
  sourceName: Sources

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

  @Prop({ type: Object })
  labelTreatments?: labelTreatmentsType[]
}

export const DecisionSchema = SchemaFactory.createForClass(DecisionModel)
