import { DecisionModel } from '../infrastructure/db/models/decision.model'
import { CreateDecisionDTO } from '../infrastructure/dto/createDecision.dto'
import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'

export class CreateDecisionUsecase {
  constructor(private mongoRepository: IDatabaseRepository) {}

  async execute(decision: CreateDecisionDTO): Promise<DecisionModel> {
    return this.mongoRepository.create(decision)
  }
}
