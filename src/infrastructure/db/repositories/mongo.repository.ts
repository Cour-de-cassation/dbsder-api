import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ServiceUnavailableException } from '@nestjs/common'
import { CreateDecisionDTO, ListDecisionsDTO } from '../../createDecisionDTO'
import { IDatabaseRepository } from '../../../domain/database.repository.interface'
import { DecisionListModel, DecisionListSchema } from '../models/decisionsList.model'
import { DecisionModel, DecisionSchema } from '../models/decision.model'
import { ServiceUnavailableException } from '@nestjs/common'

export class MongoRepository implements IDatabaseRepository {
  constructor(@InjectModel('DecisionModel') private decisionModel: Model<DecisionModel>) {}

  async listDecisions(decision: ListDecisionsDTO): Promise<DecisionListModel[]> {
      try {
        const savedDecisions = await this.decisionModel.find({
          iddecision: decision.id,
          labelStatus: decision.labelStatus,
          sourceName: decision.source,
          dateCreation: decision.dateStart
        })
        return savedDecisions
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
