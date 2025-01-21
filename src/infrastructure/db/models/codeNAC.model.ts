import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { LabelRoute } from 'dbsder-api-types'
import { Types } from 'mongoose'

@Schema()
class niveauNac {
  @Prop()
  code: string

  @Prop()
  libelle: string
}

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
  indicateurDecisionRenduePubliquement?: boolean

  @Prop()
  indicateurDebatsPublics?: boolean

  @Prop()
  indicateurAffaireSignalee: boolean

  @Prop()
  routeRelecture?: LabelRoute

  @Prop({ type: Object })
  categoriesToOmitTJ: any

  @Prop({ type: Object })
  categoriesToOmitCA: any

  @Prop()
  niveau1NAC: niveauNac

  @Prop()
  niveau2NAC: niveauNac

  @Prop()
  isInJuricaDatabase: boolean
}

export const CodeNACSchema = SchemaFactory.createForClass(CodeNAC)
