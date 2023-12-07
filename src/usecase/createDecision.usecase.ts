import { CreateDecisionDTO } from '../infrastructure/dto/createDecision.dto'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'

export class CreateDecisionUsecase {
  constructor(
    private decisionsRepository: InterfaceDecisionsRepository,
    private codeNACsRepository
  ) {}

  async execute(decision: CreateDecisionDTO): Promise<string> {
    return this.decisionsRepository.create(decision)
  }
}
