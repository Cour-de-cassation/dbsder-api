import { CreateDecisionDTO, ListDecisionsDTO } from '../infrastructure/createDecisionDTO'
import { DecisionModel } from '../infrastructure/db/models/decision.model'

export interface IDatabaseRepository {
  create(decision: CreateDecisionDTO): Promise<DecisionModel>
  list(decision: ListDecisionsDTO): Promise<DecisionModel[]>
}
