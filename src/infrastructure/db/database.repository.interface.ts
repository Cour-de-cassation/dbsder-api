import { CreateDecisionDTO } from '../dto/createDecision.dto'
import { DecisionModel } from './models/decision.model'
import { GetDecisionsListDto } from '../dto/getDecisionsList.dto'

export interface IDatabaseRepository {
  create(decision: CreateDecisionDTO): Promise<DecisionModel>
  list(decision: GetDecisionsListDto): Promise<DecisionModel[]>
}
