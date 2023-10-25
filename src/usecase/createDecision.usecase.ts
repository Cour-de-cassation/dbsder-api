import { DecisionModel } from '../infrastructure/db/models/decision.model'
import { CreateDecisionDTO } from '../infrastructure/dto/createDecision.dto'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'

export class CreateDecisionUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository) {}

  async execute(decision: CreateDecisionDTO): Promise<DecisionModel> {
    return this.decisionsRepository.create(decision)
  }
}
