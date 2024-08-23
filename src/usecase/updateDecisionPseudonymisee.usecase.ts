import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { Decision } from '../infrastructure/db/models/decision.model'

export class UpdateDecisionPseudonymiseeUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository) {}

  async execute(decisionId: string, decisionPseudonymisee: string): Promise<Decision> {
    return this.decisionsRepository.updateDecisionPseudonymisee(decisionId, decisionPseudonymisee)
  }
}
