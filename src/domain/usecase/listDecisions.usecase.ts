import { IDatabaseRepository } from '../database.repository.interface'
import { BadRequestException, Logger, ServiceUnavailableException } from '@nestjs/common'
import { ListDecisionsDTO } from '../../infrastructure/createDecisionDTO'
import { GetDecisionsListResponse } from 'src/infrastructure/controllers/responses/getDecisionsListResponse'

export class ListDecisionsUsecase {
  private readonly logger = new Logger()
  constructor(private mongoRepository: IDatabaseRepository) {}

  async execute(decision: ListDecisionsDTO): Promise<GetDecisionsListResponse[]> {
    const decisionsList = await this.mongoRepository.list(decision).catch((error) => {
      this.logger.error(error)
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message)
      }
      throw new ServiceUnavailableException('Error from repository')
    })

    return decisionsList.map((decision) => {
      return {
        id: decision.iddecision,
        source: decision.sourceName,
        status: decision.labelStatus,
        dateCreation: decision.dateCreation
      }
    })
  }
}
