import { CreateDecisionDTO } from '../../../domain/createDecisionDTO'
import { DecisionModel } from '../models/decision.model'

export interface IDatabaseRepository {
  create(decision: CreateDecisionDTO): Promise<DecisionModel>
}
