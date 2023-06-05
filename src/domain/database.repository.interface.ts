import { CreateDecisionDTO, ListDecisionsDTO } from '../infrastructure/createDecisionDTO'
import { DecisionModel } from '../infrastructure/db/models/decision.model'
import { DecisionListModel } from '../infrastructure/db/models/decisionsList.model'

export interface IDatabaseRepository {
  create(decision: CreateDecisionDTO): Promise<DecisionModel>
  listDecisions(decision: ListDecisionsDTO): Promise<DecisionListModel[]>
}
