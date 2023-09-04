import { GetDecisionByIdResponse } from '../infrastructure/controllers/responses/getDecisionById.response'
import { GetDecisionsListResponse } from '../infrastructure/controllers/responses/getDecisionsListResponse'
import { DecisionModel } from '../infrastructure/db/models/decision.model'
import { GetDecisionPseudonymiseeByIdResponse } from '../infrastructure/controllers/responses/getDecisionPseudonymiseeById.response'

export class MapModelToResponseService {
  mapGetDecisionsListModelToResponse(
    decisionsListModel: DecisionModel[]
  ): Promise<GetDecisionsListResponse[]> {
    return Promise.all(
      decisionsListModel.map((decision) => ({
        _id: decision._id,
        status: decision.labelStatus,
        source: decision.sourceName,
        dateCreation: decision.dateCreation
      }))
    )
  }

  mapGetDecisionByIdToResponse(
    getDecisionByIdModel: DecisionModel
  ): Promise<GetDecisionByIdResponse> {
    return Promise.resolve({ ...getDecisionByIdModel })
  }

  mapGetDecisionPseudonymiseeByIdToResponse(
    getDecisionByIdModel: DecisionModel
  ): Promise<GetDecisionPseudonymiseeByIdResponse> {
    return Promise.resolve(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (({ originalText, sommaire, ...decision }) => decision)(getDecisionByIdModel)
    )
  }
}
