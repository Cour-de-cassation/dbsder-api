import { GetDecisionsListResponse } from '../infrastructure/controllers/responses/getDecisionsList.response'
import { DecisionModel } from '../infrastructure/db/models/decision.model'
import { GetDecisionByIdResponse } from '../infrastructure/controllers/responses/getDecisionById.response'

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
  ): Promise<GetDecisionByIdResponse> {
    return Promise.resolve(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (({ originalText, sommaire, ...decision }) => decision)(getDecisionByIdModel)
    )
  }
}
