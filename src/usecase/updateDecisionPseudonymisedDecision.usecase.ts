import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'

export class UpdateDecisionPseudonymisedDecisionUsecase {
  constructor(private mongoRepository: IDatabaseRepository) {}

  async execute(decisionId: string, decisionPseudonymisee: string): Promise<string> {
    return this.mongoRepository.updateDecisionPseudonymisedDecision(
      decisionId,
      decisionPseudonymisee
    )
  }
}
