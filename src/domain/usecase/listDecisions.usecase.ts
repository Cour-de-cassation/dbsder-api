import { IDatabaseRepository } from '../database.repository.interface'
import { Logger, ServiceUnavailableException } from '@nestjs/common'
import { ListDecisionsDTO } from '../../infrastructure/createDecisionDTO'
import { DecisionModel } from '../../infrastructure/db/models/decision.model'

export class ListDecisionsUsecase {
  private readonly logger = new Logger()
  constructor(private mongoRepository: IDatabaseRepository) {}

  async execute(decision: ListDecisionsDTO): Promise<DecisionModel[]> {
    const decisionsList = await this.mongoRepository.list(decision).catch((error) => {
      this.logger.error(error)
      throw new ServiceUnavailableException('Error from repository')
    })
    return decisionsList
  }
}
