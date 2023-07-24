import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { DecisionModel } from '../models/decision.model'
import { GetDecisionsListDto } from '../../dto/getDecisionsList.dto'
import { CreateDecisionDTO } from '../../dto/createDecision.dto'
import { IDatabaseRepository } from '../database.repository.interface'
import { DatabaseError, UpdateFailedError } from '../../../domain/errors/database.error'
import { DecisionNotFoundError } from '../../../domain/errors/decisionNotFound.error'

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
      throw new DatabaseError(error)
    }
  }

  async create(decision: CreateDecisionDTO): Promise<DecisionModel> {
    const savedDecision = await this.decisionModel.create(decision).catch((error) => {
      throw new DatabaseError(error)
    })
    return Promise.resolve(savedDecision)
  }
  async getDecisionById(id: string): Promise<DecisionModel> {
    const decision = await this.decisionModel
      .findOne({ id })
      .lean()
      .catch((error) => {
        throw new DatabaseError(error)
      })
    return decision
  }

  async updateDecisionStatus(id: string, status: string): Promise<string> {
    const result = await this.decisionModel
      .updateOne({ id: id }, { $set: { labelStatus: status } })
      .catch((error) => {
        throw new DatabaseError(error)
      })

    if (result.matchedCount === 0 && result.acknowledged) {
      throw new DecisionNotFoundError()
    }

    // Acknowledged peut être à false si Mongoose est incapable d'exécuter la requête
    if (!result.acknowledged) {
      throw new UpdateFailedError('Mongoose error while updating decision status')
    }

    return id
  }

  async updateDecisionPseudonymisedDecision(
    id: string,
    decisionPseudonymisee: string
  ): Promise<string> {
    const result = await this.decisionModel
      .updateOne({ id: id }, { $set: { decisionPseudonymisee: decisionPseudonymisee } })
      .catch((error) => {
        throw new DatabaseError(error)
      })

    if (result.matchedCount === 0 && result.acknowledged) {
      throw new DecisionNotFoundError()
    }

    // Acknowledged peut être à false si Mongoose est incapable d'exécuter la requête
    if (!result.acknowledged) {
      throw new UpdateFailedError('Mongoose error while updating decision status')
    }

    return id
  }
}
