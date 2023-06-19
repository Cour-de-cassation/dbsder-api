import { Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'

export class FetchDecisionByIdUsecase {
  constructor(private mongoRepository: IDatabaseRepository) {}
  private logger = new Logger()

  //TODO : Mapping de Model vers Response à faire
  async execute(id: string) {
    const decision = await this.mongoRepository.getDecisionById(id).catch((error) => {
      if (error instanceof NotFoundException) {
        this.logger.error(error)
        throw new NotFoundException("La décision n'existe pas")
      }
      this.logger.error(error)
      throw new ServiceUnavailableException('Error from repository')
    })

    return decision
  }
}
