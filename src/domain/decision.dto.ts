import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { DecisionStatus } from 'src/domain/enum'

@Schema()
export class DecisionDTO {
  @Prop()
  id: string

  @Prop()
  source: string

  @Prop()
  status: DecisionStatus

  @Prop()
  dateCreation: string
}

export const DecisionSchema = SchemaFactory.createForClass(DecisionDTO)
