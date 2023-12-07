import { Decision } from '../infrastructure/db/models/decision.model'
import { CreateDecisionDTO } from '../infrastructure/dto/createDecision.dto'
import { RapportOccultation } from '../infrastructure/dto/updateDecision.dto'
import { GetDecisionsListDto } from '../infrastructure/dto/getDecisionsList.dto'

export interface InterfaceDecisionsRepository {
  create(decision: CreateDecisionDTO, codeNAC: string): Promise<string>
  list(decision: GetDecisionsListDto): Promise<Decision[]>
  getById(id: string): Promise<Decision>
  updateStatut(id: string, status: string): Promise<string>
  updateDecisionPseudonymisee(id: string, decisionPseudonymisee: string): Promise<string>
  updateRapportsOccultations(
    id: string,
    rapportsOccultations: RapportOccultation[]
  ): Promise<string>
  removeById(id: string): Promise<void>
}
