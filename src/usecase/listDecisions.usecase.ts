import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'
import { BadRequestException, Logger, ServiceUnavailableException } from '@nestjs/common'
import { GetDecisionsListResponse } from 'src/infrastructure/controllers/responses/getDecisionsListResponse'
import { MapDTOToDomainObjectService } from '../service/mapDTOToDomainObject.service'
import {
  DecisionSearchCriteria,
  mapDecisionSearchCriteriaToDTO
} from '../domain/decisionSearchCriteria'

export class ListDecisionsUsecase {
  private readonly logger = new Logger()
  constructor(private mongoRepository: IDatabaseRepository) {}

  async execute(
    decisionSearchCriteria: DecisionSearchCriteria
  ): Promise<GetDecisionsListResponse[]> {
    const decisionDTO = mapDecisionSearchCriteriaToDTO(decisionSearchCriteria)
    const decisionsList = await this.mongoRepository.list(decisionDTO).catch((error) => {
      this.logger.error(error)
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message)
      }
      throw new ServiceUnavailableException('Error from repository')
    })

    return new MapDTOToDomainObjectService().mapGetDecisionsListModelToObjectDomain(decisionsList)
  }
}
