import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ServiceUnavailableException } from '@nestjs/common'
import { CreateDecisionDTO, ListDecisionsDTO } from '../../createDecisionDTO'
import { IDatabaseRepository } from '../../../domain/database.repository.interface'
import { DecisionModel } from '../models/decision.model'

export class MongoRepository implements IDatabaseRepository {
  constructor(@InjectModel('DecisionModel') private decisionModel: Model<DecisionModel>) {}

  async list(decision: ListDecisionsDTO): Promise<DecisionModel[]> {
    try {
      const savedDecisions = await this.decisionModel.find({
        labelStatus: decision.status,
        sourceName: decision.source
        //dateCreation: decision.startDate
      })
      return Promise.resolve(savedDecisions)
      //return await this.decisionModel.find({}).lean()
    } catch (error) {
      throw new ServiceUnavailableException('Error from database')
    }
    return null
  }

  async create(decision: CreateDecisionDTO): Promise<DecisionModel> {
    const savedDecision = await this.decisionModel.create(decision).catch(() => {
      throw new ServiceUnavailableException('Error from database')
    })
    return Promise.resolve(savedDecision)
  }
}
