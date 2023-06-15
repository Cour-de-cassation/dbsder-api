import { IDatabaseRepository } from '../domain/database.repository.interface'
import { BadRequestException, Logger, ServiceUnavailableException } from '@nestjs/common'
import { GetDecisionsListResponse } from 'src/infrastructure/controllers/responses/getDecisionsListResponse'
import { GetDecisionsListDto } from '../infrastructure/dto/getDecisionsList.dto'
import { MapDTOToDomainObjectService } from '../service/mapDTOToDomainObject.service'

export class ListDecisionsUsecase {
  private readonly logger = new Logger()
  constructor(private mongoRepository: IDatabaseRepository) {}

  async execute(decision: GetDecisionsListDto): Promise<GetDecisionsListResponse[]> {
    const decisionsList = await this.mongoRepository.list(decision).catch((error) => {
      this.logger.error(error)
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message)
      }
      throw new ServiceUnavailableException('Error from repository')
    })

    return new MapDTOToDomainObjectService().mapGetDecisionsListModelToObjectDomain(decisionsList)
  }
}
