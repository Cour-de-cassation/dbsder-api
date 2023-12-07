import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { CodeNAC } from 'dbsder-api-types'
import { CodeNACNotFoundError } from '../../../domain/errors/codeNAC.error'

export class CodeNACsRepository {
  constructor(@InjectModel('CodeNAC') private codeNacModel: Model<CodeNAC>) {}

  async getByCodeNac(codeNac: string): Promise<CodeNAC> {
    const codeNAC = await this.codeNacModel
      .findOne({ codeNAC: codeNac })
      .lean()
      .catch(() => {
        throw new CodeNACNotFoundError()
      })
    return codeNAC
  }
}
