import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { DatabaseError } from '../../../domain/errors/database.error'
import { CodeNAC } from '../models/codeNAC.model'

export class CodeNACsRepository {
  constructor(@InjectModel('CodeNAC') private codeNACModel: Model<CodeNAC>) {}

  async getByCodeNac(codeNac: string): Promise<CodeNAC> {
    const codeNAC = await this.codeNACModel
      .findOne({ codeNAC: codeNac })
      .lean()
      .catch((error) => {
        throw new DatabaseError(error)
      })
    return codeNAC
  }
}
