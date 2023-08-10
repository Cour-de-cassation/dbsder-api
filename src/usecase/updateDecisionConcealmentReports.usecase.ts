import { RapportOccultation } from '../infrastructure/dto/updateDecision.dto'
import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'

export class UpdateDecisionConcealmentReportsUsecase {
  constructor(private mongoRepository: IDatabaseRepository) {}

  async execute(decisionId: string, rapportsOccultations: RapportOccultation[]): Promise<string> {
    return this.mongoRepository.updateDecisionConcealmentReports(decisionId, rapportsOccultations)
  }
}
