import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { DecisionStatus, Sources } from '../../../domain/enum'

@Schema()
export class DecisionListModel {
  @Prop()
  idDecision: string

  @Prop()
  labelStatus: DecisionStatus

  @Prop()
  source: Sources

  @Prop()
  dateStart: string

  @Prop()
  dateEnd: string
}

export const DecisionListSchema = SchemaFactory.createForClass(DecisionListModel)
