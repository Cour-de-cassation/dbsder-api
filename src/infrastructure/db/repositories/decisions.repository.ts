import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Decision } from '../models/decision.model'
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
import { Logger } from '@nestjs/common'
import { LogsFormat } from '../../utils/logsFormat.utils'

export class DecisionsRepository implements InterfaceDecisionsRepository {
  private readonly logger = new Logger()

  constructor(@InjectModel('Decision') private decisionModel: Model<Decision>) {}

  async list(decisionSearchParams: GetDecisionsListDto): Promise<Decision[]> {
    try {
      const findCriterias = this.mapDecisionSearchParametersToFindCriteria(decisionSearchParams)

      const foundDecisions = await this.decisionModel.find(findCriterias)
      return Promise.resolve(foundDecisions)
    } catch (error) {
      throw new DatabaseError(error)
    }
  }

  async create(decision: CreateDecisionDTO): Promise<string> {
    const now = new Date()
    const oldDecision = await this.decisionModel.findOne({
      sourceId: decision.sourceId,
      sourceName: decision.sourceName
    })

    const decisionModel = {
      ...decision,
      firstImportDate: oldDecision?.firstImportDate ?? now.toISOString(),
      lastImportDate: now.toISOString(),
      publishDate: null,
      unpublishDate: null
    }

    const savedDecision = await this.decisionModel
      .findOneAndUpdate(
        {
          sourceId: decision.sourceId,
          sourceName: decision.sourceName
        },
        decisionModel,
        {
          upsert: true,
          new: true,
          lean: true
        }
      )
      .catch((error) => {
        throw new DatabaseError(error)
      })

    const decisionToLog = {
      sourceId: decision.sourceId,
      sourceName: decision.sourceName,
      idDecision: decision.idDecisionWinci,
      jurisdictionCode: decision.jurisdictionCode,
      jurisdictionName: decision.jurisdictionName,
      dateDecision: decision.dateDecision,
      numeroRoleGeneral: decision.numeroRoleGeneral,
      labelStatus: decision.labelStatus,
      NACCode: decision.NACCode,
      recommandationOccultation: decision.recommandationOccultation,
      occultation: { motivationOccultation: decision.occultation.motivationOccultation }
    }

    const formatLogs: LogsFormat = {
      operationName: 'create',
      msg: `Decision created with id ${savedDecision._id.toString()}`,
      data: { decision: decisionToLog }
    }
    this.logger.log(formatLogs)
    return Promise.resolve(savedDecision._id.toString())
  }

  async getById(id: string): Promise<Decision> {
    const decision = await this.decisionModel
      .findOne({ _id: new Types.ObjectId(id) })
      .lean()
      .catch((error) => {
        throw new DatabaseError(error)
      })
    return decision
  }

  async removeById(id: string): Promise<void> {
    const removalResponse = await this.decisionModel
      .deleteOne({ _id: new Types.ObjectId(id) })
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
      .updateOne({ _id: new Types.ObjectId(id) }, { $set: { labelStatus: status } })
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
      .updateOne({ _id: new Types.ObjectId(id) }, { $set: { pseudoText: decisionPseudonymisee } })
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
      .updateOne(
        { _id: new Types.ObjectId(id) },
        { $set: { labelTreatments: rapportsOccultations } }
      )
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

  mapDecisionSearchParametersToFindCriteria(decisionSearchParams: GetDecisionsListDto) {
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
