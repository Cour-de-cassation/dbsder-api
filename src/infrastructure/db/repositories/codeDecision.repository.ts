import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { DatabaseError } from '../../../domain/errors/database.error'
import { CodeDecision } from '../models/codeDecision.model'

export class CodeDecisionRepository {
  constructor(@InjectModel('CodeDecision') private codeDecisionModel: Model<CodeDecision>) {}

  async getByCodeDecision(codeDecision: string): Promise<CodeDecision> {
    return await this.codeDecisionModel
      .findOne({ codeDecision: codeDecision })
      .lean()
      .catch((error) => {
        throw new DatabaseError(error)
      })
  }
}
