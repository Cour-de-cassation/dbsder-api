import { DecisionModel } from '../infrastructure/db/models/decision.model'
import { CreateDecisionDTO } from '../infrastructure/dto/createDecision.dto'
import { RapportOccultation } from '../infrastructure/dto/updateDecision.dto'
import { GetDecisionsListDto } from '../infrastructure/dto/getDecisionsList.dto'

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
