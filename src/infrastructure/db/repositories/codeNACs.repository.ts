import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { CodeNAC } from 'dbsder-api-types'
import { DatabaseError } from '../../../domain/errors/database.error'

export class CodeNACsRepository {
  constructor(@InjectModel('CodeNAC') private codeNacModel: Model<CodeNAC>) {}

  async getByCodeNac(codeNac: string): Promise<CodeNAC> {
    const codeNAC = await this.codeNacModel
      .findOne({ codeNAC: codeNac })
      .lean()
      .catch((error) => {
        throw new DatabaseError(error)
      })
    return codeNAC
  }
}
