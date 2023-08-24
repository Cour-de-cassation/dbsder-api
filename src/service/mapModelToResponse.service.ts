import { GetDecisionByIdResponse } from '../infrastructure/controllers/responses/getDecisionById.response'
import { GetDecisionsListResponse } from '../infrastructure/controllers/responses/getDecisionsListResponse'
import { DecisionModel } from '../infrastructure/db/models/decision.model'
import { GetPseudonymizedDecisionByIdResponse } from '../infrastructure/controllers/responses/getPseudonymizedDecisionById.response'

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

  mapGetPseudonymizedDecisionByIdToResponse(
    getDecisionByIdModel: DecisionModel
  ): Promise<GetPseudonymizedDecisionByIdResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Promise.resolve((({ originalText, ...decision }) => decision)(getDecisionByIdModel))
  }
}
