import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema()
class CategorieCodeDecision {
  @Prop()
  code: string

  @Prop()
  libelle: string
}

@Schema()
export class CodeDecision {
  @Prop()
  _id: Types.ObjectId

  @Prop()
  codeDecision: string

  @Prop()
  libelleCodeDecision: string

  @Prop()
  categorieCodeDecision: CategorieCodeDecision

  @Prop()
  routeCA: string

  @Prop()
  routeTJ: string

  @Prop()
  overwritesNAC: boolean
}

export const CodeDecisionSchema = SchemaFactory.createForClass(CodeDecision)
