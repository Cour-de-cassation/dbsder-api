import { CreateDecisionDTO } from '../infrastructure/createDecisionDTO'
import { DecisionModel } from '../infrastructure/db/models/decision.model'
import { GetDecisionListDTO } from './getDecisionList.dto'

export interface IDatabaseRepository {
  create(decision: CreateDecisionDTO): Promise<DecisionModel>
  list(decision: GetDecisionListDTO): Promise<DecisionModel[]>
}
