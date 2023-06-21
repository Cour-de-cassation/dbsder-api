import { CreateDecisionDTO } from '../infrastructure/dto/createDecision.dto'
import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'
import { DecisionModel } from '../infrastructure/db/models/decision.model'

export class CreateDecisionUsecase {
  constructor(private mongoRepository: IDatabaseRepository) {}

  async execute(decision: CreateDecisionDTO): Promise<DecisionModel> {
    const savedDecision = await this.mongoRepository.create(decision)
    return savedDecision
  }
}
