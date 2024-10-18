import { RapportOccultation } from '../infrastructure/dto/updateDecision.dto'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'

export class UpdateRapportsOccultationsUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository) {
  }

  async execute(decisionId: string, rapportsOccultations: RapportOccultation[]): Promise<string> {
    return this.decisionsRepository.updateRapportsOccultations(decisionId, rapportsOccultations)
  }
}
