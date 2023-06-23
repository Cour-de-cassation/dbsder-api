import { GetDecisionByIdResponse } from 'src/infrastructure/controllers/responses/getDecisionById.response'
import { GetDecisionsListResponse } from '../infrastructure/controllers/responses/getDecisionsListResponse'
import { DecisionModel } from '../infrastructure/db/models/decision.model'

export class MapModelToResponseService {
  mapGetDecisionsListModelToResponse(
    decisionsListModel: DecisionModel[]
  ): Promise<GetDecisionsListResponse[]> {
    return Promise.all(
      decisionsListModel.map((decision) => ({
        id: decision.id,
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
}
