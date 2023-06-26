import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { DecisionModel } from '../models/decision.model'
import { GetDecisionsListDto } from '../../dto/getDecisionsList.dto'
import { CreateDecisionDTO } from '../../dto/createDecision.dto'
import { IDatabaseRepository } from '../database.repository.interface'

export class MongoRepository implements IDatabaseRepository {
  constructor(@InjectModel('DecisionModel') private decisionModel: Model<DecisionModel>) {}

  async list(decision: GetDecisionsListDto): Promise<DecisionModel[]> {
    try {
      const savedDecisions = await this.decisionModel.find({
        labelStatus: decision.status,
        sourceName: decision.source,
        dateCreation: { $gte: decision.startDate, $lte: decision.endDate }
      })
      return Promise.resolve(savedDecisions)
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
  async getDecisionById(id: string): Promise<DecisionModel> {
    const decision = await this.decisionModel
      .findOne({ id })
      .lean()
      .catch(() => {
        throw new ServiceUnavailableException('Error from database')
      })

    if (!decision) {
      throw new NotFoundException('Decision not found')
    }
    return decision
  }
}
