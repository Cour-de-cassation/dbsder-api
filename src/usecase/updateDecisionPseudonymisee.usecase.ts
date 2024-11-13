import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'

export class UpdateDecisionPseudonymiseeUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository) {}

  async execute(decisionId: string, decisionPseudonymisee: string): Promise<string> {
    return this.decisionsRepository.updateDecisionPseudonymisee(decisionId, decisionPseudonymisee)
  }
}
