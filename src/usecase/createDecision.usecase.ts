import { CreateDecisionDTO } from '../infrastructure/dto/createDecision.dto'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { CodeNACsRepository } from '../infrastructure/db/repositories/codeNACs.repository'

export class CreateDecisionUsecase {
  constructor(
    private decisionsRepository: InterfaceDecisionsRepository,
    private codeNACsRepository: CodeNACsRepository
  ) {}

  async execute(decision: CreateDecisionDTO, codeNAC: string): Promise<string> {
    const givenCodeNAC = await this.codeNACsRepository.getByCodeNac(codeNAC)

    // gestion bloc occultation ?

    return this.decisionsRepository.create(decision, givenCodeNAC.codeNAC)
  }
}
