import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema()
export class CodeNAC {
  @Prop()
  _id: Types.ObjectId

  @Prop()
  codeNAC: string

  @Prop()
  libelleNAC: string

  @Prop()
  blocOccultationCA: number

  @Prop()
  blocOccultationTJ: number

  @Prop()
  indicateurDecisionRenduePubliquement?: string

  @Prop()
  indicateurDebatsPublics?: string

  @Prop()
  indicateurAffaireSignalee: number

  @Prop()
  routeRelecture?: string

  @Prop({ type: Object })
  categoriesToOmitTJ: object

  @Prop({ type: Object })
  categoriesToOmitCA: object
}

export const CodeNacSchema = SchemaFactory.createForClass(CodeNAC)
