import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Decision } from '../models/decision.model'
import { InterfaceDecisionsRepository } from '../../../domain/decisions.repository.interface'
import { DatabaseError } from '../../../domain/errors/database.error'

export class CodeNACsRepository implements InterfaceDecisionsRepository {
  constructor(@InjectModel('CodeNAC') private codeNacModel: Model<CodeNAC>) {}

  async getCodeNacBy(id: string): Promise<Decision> {
    const decision = await this.decisionModel
      .findOne({ _id: new Types.ObjectId(id) })
      .lean()
      .catch((error) => {
        throw new DatabaseError(error)
      })
    return decision
  }
}
