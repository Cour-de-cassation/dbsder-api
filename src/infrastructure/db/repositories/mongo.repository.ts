import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { BadRequestException, ServiceUnavailableException } from '@nestjs/common'
import { CreateDecisionDTO, ListDecisionsDTO } from '../../createDecisionDTO'
import { IDatabaseRepository } from '../../../domain/database.repository.interface'
import { DecisionModel } from '../models/decision.model'
import { parseDate } from '../../utils/parseDate.utils'

export class MongoRepository implements IDatabaseRepository {
  constructor(@InjectModel('DecisionModel') private decisionModel: Model<DecisionModel>) {}

  async list(decision: ListDecisionsDTO): Promise<DecisionModel[]> {
    try {
      const isStartDateLaterThanEndDate =
        parseDate(decision.startDate) > parseDate(decision.endDate)
      if (isStartDateLaterThanEndDate) {
        throw new BadRequestException('startDate cannot be greater than endDate')
      }
      const savedDecisions = await this.decisionModel.find({
        labelStatus: decision.status,
        sourceName: decision.source,
        dateCreation: !isStartDateLaterThanEndDate
          ? { $gte: decision.startDate, $lte: decision.endDate }
          : ''
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
}
