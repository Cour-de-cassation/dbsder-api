import { GetDecisionsListResponse } from '../infrastructure/controllers/responses/getDecisionsList.response'
import { Decision } from '../infrastructure/db/models/decision.model'
import { GetDecisionByIdResponse } from '../infrastructure/controllers/responses/getDecisionById.response'

export class MapModelToResponseService {
  mapGetDecisionsListModelToResponse(
    decisionsListModel: Decision[]
  ): Promise<GetDecisionsListResponse[]> {
    return Promise.all(
      decisionsListModel.map((decision) => ({
        _id: decision._id.toString(),
        status: decision.labelStatus,
        source: decision.sourceName,
        dateCreation: decision.dateCreation
      }))
    )
  }

  mapGetDecisionByIdToResponse(getDecisionByIdModel: Decision): Promise<GetDecisionByIdResponse> {
    return Promise.resolve({ ...getDecisionByIdModel, _id: getDecisionByIdModel._id.toString() })
  }

  mapGetDecisionPseudonymiseeByIdToResponse(
    getDecisionByIdModel: Decision
  ): Promise<GetDecisionByIdResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { originalText, sommaire, parties, ...decisionWithoutProperties } = getDecisionByIdModel
    return Promise.resolve({
      ...decisionWithoutProperties,
      _id: getDecisionByIdModel._id.toString()
    })
  }
}
