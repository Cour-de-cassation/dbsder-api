import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { DecisionModel } from '../models/decision.model'
import { CreateDecisionDTO } from '../../dto/createDecision.dto'
import { RapportOccultation } from '../../dto/updateDecision.dto'
import { GetDecisionsListDto } from '../../dto/getDecisionsList.dto'
import { InterfaceDecisionsRepository } from '../../../domain/decisions.repository.interface'
import {
  DatabaseError,
  DeleteFailedError,
  UpdateFailedError
} from '../../../domain/errors/database.error'
import { DecisionNotFoundError } from '../../../domain/errors/decisionNotFound.error'

export class DecisionsRepository implements InterfaceDecisionsRepository {
  constructor(@InjectModel('DecisionModel') private decisionModel: Model<DecisionModel>) {}

  async list(decisionSearchParams: GetDecisionsListDto): Promise<DecisionModel[]> {
    try {
      const findCriterias = this.mapDecisionSearchParametersToFindCriterias(decisionSearchParams)

      const savedDecisions = await this.decisionModel.find(findCriterias)
      return Promise.resolve(savedDecisions)
    } catch (error) {
      throw new DatabaseError(error)
    }
  }

  async create(decision: CreateDecisionDTO): Promise<DecisionModel> {
    const savedDecision: DecisionModel = await this.decisionModel
      .findOneAndUpdate({ _id: decision._id }, decision, { upsert: true, new: true })
      .catch((error) => {
        throw new DatabaseError(error)
      })
    return Promise.resolve(savedDecision)
  }

  async getById(id: string): Promise<DecisionModel> {
    const decision = await this.decisionModel
      .findOne({ _id: id })
      .lean()
      .catch((error) => {
        throw new DatabaseError(error)
      })
    return decision
  }

  async removeById(id: string): Promise<void> {
    const removalResponse = await this.decisionModel
      .deleteOne({ _id: id })
      .lean()
      .catch((error) => {
        throw new DatabaseError(error)
      })
    if (removalResponse.deletedCount === 0) {
      throw new DecisionNotFoundError()
    }
    if (!removalResponse.acknowledged) {
      throw new DeleteFailedError('Mongoose error while deleting decision')
    }
  }

  async updateStatut(id: string, status: string): Promise<string> {
    const result = await this.decisionModel
      .updateOne({ _id: id }, { $set: { labelStatus: status } })
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

  async updateDecisionPseudonymisee(id: string, decisionPseudonymisee: string): Promise<string> {
    const result = await this.decisionModel
      .updateOne({ _id: id }, { $set: { pseudoText: decisionPseudonymisee } })
      .catch((error) => {
        throw new DatabaseError(error)
      })

    if (result.matchedCount === 0 && result.acknowledged) {
      throw new DecisionNotFoundError()
    }

    // Acknowledged peut être à false si Mongoose est incapable d'exécuter la requête
    if (!result.acknowledged) {
      throw new UpdateFailedError('Mongoose error while updating decision pseudonymised decision')
    }

    return id
  }

  async updateRapportsOccultations(
    id: string,
    rapportsOccultations: RapportOccultation[]
  ): Promise<string> {
    const result = await this.decisionModel
      .updateOne({ _id: id }, { $set: { labelTreatments: rapportsOccultations } })
      .catch((error) => {
        throw new DatabaseError(error)
      })

    if (result.matchedCount === 0 && result.acknowledged) {
      throw new DecisionNotFoundError()
    }

    // Acknowledged peut être à false si Mongoose est incapable d'exécuter la requête
    if (!result.acknowledged) {
      throw new UpdateFailedError('Mongoose error while updating decision concealment reports')
    }

    return id
  }

  mapDecisionSearchParametersToFindCriterias(decisionSearchParams: GetDecisionsListDto) {
    const todayDate = new Date().toISOString().slice(0, 10)
    // syntax :  https://medium.com/@slamflipstrom/conditional-object-properties-using-spread-in-javascript-714e0a12f496
    return {
      ...(decisionSearchParams.status && { labelStatus: decisionSearchParams.status }),
      ...(decisionSearchParams.source && { sourceName: decisionSearchParams.source }),
      ...(decisionSearchParams.startDate && {
        dateCreation: { $gte: decisionSearchParams.startDate, $lte: todayDate }
      }),
      ...(decisionSearchParams.endDate && {
        dateCreation: { $lte: decisionSearchParams.endDate, $gte: todayDate }
      }),
      ...(decisionSearchParams.startDate &&
        decisionSearchParams.endDate && {
          dateCreation: {
            $gte: decisionSearchParams.startDate,
            $lte: decisionSearchParams.endDate
          }
        }),
      ...(decisionSearchParams.number && {
        $or: [
          {
            numeroRoleGeneral: decisionSearchParams.number
          },
          { appeals: decisionSearchParams.number }
        ]
      })
    }
  }
}
