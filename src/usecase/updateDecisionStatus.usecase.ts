import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'

export class UpdateDecisionStatusUsecase {
  constructor(private mongoRepository: IDatabaseRepository) {}

  async execute(decisionId: string, decisionStatus: string): Promise<string> {
    return this.mongoRepository.updateDecisionStatus(decisionId, decisionStatus)
  }
}
