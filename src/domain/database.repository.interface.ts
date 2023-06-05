import { CreateDecisionDTO, ListDecisionsDTO } from '../infrastructure/createDecisionDTO'
import { DecisionListModel, DecisionModel } from '../infrastructure/db/models/decision.model'

export interface IDatabaseRepository {
  create(decision: CreateDecisionDTO): Promise<DecisionModel>
  listDecisions(decision: ListDecisionsDTO): Promise<DecisionListModel[]>
}
