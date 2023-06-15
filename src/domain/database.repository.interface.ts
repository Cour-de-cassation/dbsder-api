import { CreateDecisionDTO } from '../infrastructure/dto/createDecision.dto'
import { DecisionModel } from '../infrastructure/db/models/decision.model'
import { GetDecisionsListDto } from '../infrastructure/dto/getDecisionsList.dto'

export interface IDatabaseRepository {
  create(decision: CreateDecisionDTO): Promise<DecisionModel>
  list(decision: GetDecisionsListDto): Promise<DecisionModel[]>
}
