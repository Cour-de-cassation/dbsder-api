import { DecisionModel } from './models/decision.model'
import { CreateDecisionDTO } from '../dto/createDecision.dto'
import { RapportOccultation } from '../dto/updateDecision.dto'
import { GetDecisionsListDto } from '../dto/getDecisionsList.dto'

export interface InterfaceDecisionsRepository {
  create(decision: CreateDecisionDTO): Promise<DecisionModel>
  list(decision: GetDecisionsListDto): Promise<DecisionModel[]>
  getById(id: string): Promise<DecisionModel>
  updateStatut(id: string, status: string): Promise<string>
  updateDecisionPseudonymisee(id: string, decisionPseudonymisee: string): Promise<string>
  updateRapportsOccultations(
    id: string,
    rapportsOccultations: RapportOccultation[]
  ): Promise<string>
}
