import { Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'
import { GetDecisionByIdResponse } from '../infrastructure/controllers/responses/getDecisionById.response'
import { MapModelToResponseService } from '../service/mapModelToResponse.service'

export class FetchDecisionByIdUsecase {
  constructor(private mongoRepository: IDatabaseRepository) {}
  private logger = new Logger()

  async execute(id: string): Promise<GetDecisionByIdResponse> {
    const decision = await this.mongoRepository.getDecisionById(id).catch((error) => {
      if (error instanceof NotFoundException) {
        this.logger.error(error)
        throw new NotFoundException("La décision n'existe pas")
      }
      this.logger.error(error)
      throw new ServiceUnavailableException('Error from repository')
    })

    return new MapModelToResponseService().mapGetDecisionByIdToResponse(decision)
  }
}
