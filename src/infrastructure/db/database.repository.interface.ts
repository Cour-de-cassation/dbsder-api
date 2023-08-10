import { DecisionModel } from './models/decision.model'
import { CreateDecisionDTO } from '../dto/createDecision.dto'
import { RapportOccultation } from '../dto/updateDecision.dto'
import { GetDecisionsListDto } from '../dto/getDecisionsList.dto'

export interface IDatabaseRepository {
  create(decision: CreateDecisionDTO): Promise<DecisionModel>
  list(decision: GetDecisionsListDto): Promise<DecisionModel[]>
  getDecisionById(id: string): Promise<DecisionModel>
  updateDecisionStatus(id: string, status: string): Promise<string>
  updateDecisionPseudonymisedDecision(id: string, decisionPseudonymisee: string): Promise<string>
  updateDecisionConcealmentReports(
    id: string,
    rapportsOccultations: RapportOccultation[]
  ): Promise<string>
}
