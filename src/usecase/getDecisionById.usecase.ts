import { Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { IDatabaseRepository } from '../database.repository.interface'

export class GetDecisionByIdUsecase {
  constructor(private mongoRepository: IDatabaseRepository) {}
  private logger = new Logger()

  async execute(id: string) {
    const decision = await this.mongoRepository.getDecisionById(id).catch((error) => {
      this.logger.error(error)
      throw new ServiceUnavailableException('Error from repository')
    })
    if (!decision) {
      throw new NotFoundException('No decisions were found')
    }
    return decision
  }
}
