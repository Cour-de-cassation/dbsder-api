import { CreateDecisionDTO } from '../createDecisionDTO'
import { Logger, ServiceUnavailableException } from '@nestjs/common'
import { IDatabaseRepository } from '../../infrastructure/db/repositories/database.repository.interface'
import { DecisionModel } from '../../infrastructure/db/models/decision.model'

export class CreateDecisionUsecase {
  private readonly logger = new Logger()
  constructor(private mongoRepository: IDatabaseRepository) {}

  async execute(decision: CreateDecisionDTO): Promise<DecisionModel> {
    const savedDecision = await this.mongoRepository.create(decision).catch((error) => {
      this.logger.error(error)
      throw new ServiceUnavailableException('Error from repository')
    })
    return savedDecision
  }
}
