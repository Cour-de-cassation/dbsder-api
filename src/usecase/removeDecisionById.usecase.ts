import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'

export class RemoveDecisionByIdUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository) {}

  async execute(id: string): Promise<void> {
    await this.decisionsRepository.removeById(id)
  }
}
