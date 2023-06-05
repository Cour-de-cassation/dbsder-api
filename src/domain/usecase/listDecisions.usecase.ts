import { IDatabaseRepository } from '../database.repository.interface'
import { Logger, ServiceUnavailableException } from '@nestjs/common'
import { DecisionListModel } from '../../infrastructure/db/models/decision.model'
import { ListDecisionsDTO } from '../../infrastructure/createDecisionDTO'

export class ListDecisionsUsecase {
  private readonly logger = new Logger()
  constructor(private mongoRepository: IDatabaseRepository) {}

  async execute(decision: ListDecisionsDTO): Promise<DecisionListModel[]> {
    const decisionsList = await this.mongoRepository.listDecisions(decision).catch((error) => {
      this.logger.error(error)
      throw new ServiceUnavailableException('Error from repository')
    })
    return decisionsList
  }
}
