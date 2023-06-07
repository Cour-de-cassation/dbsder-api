import { DecisionModel } from '../db/models/decision.model'
import { GetDecisionsListResponse } from '../controllers/responses/getDecisionsListResponse'
import { MockUtils } from '../utils/mock.utils'
import { GetDecisionListDTO } from '../../domain/getDecisionList.dto'

export class DecisionListPresenter {
  present(decision: GetDecisionListDTO): GetDecisionsListResponse[] {
    return new MockUtils().allDecisionsToBeTreated
  }
}
