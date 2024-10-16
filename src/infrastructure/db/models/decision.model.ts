import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import {
  DecisionAnalyse,
  LabelStatus,
  DecisionOccultation,
  LabelTreatment,
  Sources,
  DecisionAssociee,
  President,
  Occultation,
  PartieTJ,
  Zoning,
  PublishStatus
} from 'dbsder-api-types'
import { Types } from 'mongoose'

@Schema()
export class Decision {
  @Prop()
  _id: Types.ObjectId

  @Prop({ type: Object })
  analysis?: DecisionAnalyse

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
  importDate: string

  @Prop()
  publishDate: string

  @Prop()
  unpublishDate: string

  @Prop()
  decatt?: number[]

  @Prop()
  jurisdictionCode: string

  @Prop()
  jurisdictionId: string

  @Prop()
  jurisdictionName: string

  @Prop()
  labelStatus: LabelStatus

  @Prop()
  publishStatus: PublishStatus

  @Prop({ type: Object })
  occultation: DecisionOccultation

  @Prop()
  originalText: string

  @Prop()
  parties: PartieTJ[] | object[]

  @Prop()
  pseudoStatus?: string

  @Prop()
  pseudoText?: string

  @Prop()
  public?: boolean

  @Prop()
  registerNumber: string

  @Prop()
  solution?: string

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

  @Prop({ type: Object })
  originalTextZoning: Zoning

  @Prop({ type: Object })
  pseudoTextZoning?: Zoning

  @Prop()
  publication?: string[]

  @Prop()
  formation?: string

  @Prop()
  blocOccultation: number

  @Prop()
  NAOCode?: string

  @Prop()
  natureAffaireCivil?: string

  @Prop()
  natureAffairePenal?: string

  @Prop()
  codeMatiereCivil?: string

  @Prop()
  NACCode?: string

  @Prop()
  NPCode?: string

  @Prop()
  endCaseCode?: string

  @Prop()
  libelleEndCaseCode?: string

  @Prop()
  filenameSource?: string

  @Prop()
  pubCategory?: string

  @Prop({ type: Object })
  labelTreatments?: LabelTreatment[]

  @Prop()
  codeNature: string

  @Prop()
  codeService: string

  @Prop()
  debatPublic: boolean

  @Prop({ type: Object })
  decisionAssociee: DecisionAssociee

  @Prop()
  libelleNAC: string

  @Prop()
  libelleNatureParticuliere?: string

  @Prop()
  libelleService: string

  @Prop()
  matiereDeterminee: boolean

  @Prop()
  numeroRoleGeneral: string

  @Prop()
  pourvoiCourDeCassation: boolean

  @Prop()
  pourvoiLocal: boolean

  @Prop({ type: Object })
  president?: President

  @Prop({ type: Object })
  recommandationOccultation: Occultation

  @Prop()
  sommaire?: string

  @Prop()
  selection: boolean

  @Prop()
  indicateurQPC?: boolean

  @Prop()
  idDecisionWinci?: string

  @Prop()
  idDecisionTJ?: string
}

export const DecisionSchema = SchemaFactory.createForClass(Decision)
