import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'

export class UpdateStatutUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository) {}

  async execute(decisionId: string, decisionStatus: string): Promise<string> {
    return this.decisionsRepository.updateStatut(decisionId, decisionStatus)
  }
}
