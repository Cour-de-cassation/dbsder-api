import { GetDecisionsListResponse } from '../infrastructure/controllers/responses/getDecisionsListResponse'
import { DecisionModel } from '../infrastructure/db/models/decision.model'

export class MapModelToResponseService {
  mapGetDecisionsListModelToResponse(
    decisionsListModel: DecisionModel[]
  ): Promise<GetDecisionsListResponse[]> {
    return Promise.all(
      decisionsListModel.map((decision) => ({
        id: decision.iddecision,
        status: decision.labelStatus,
        source: decision.sourceName,
        dateCreation: decision.dateCreation
      }))
    )
  }
}
