import {
  DecisionSearchCriteria,
  mapDecisionSearchCriteriaToDTO
} from '../domain/decisionSearchCriteria'
import { MapModelToResponseService } from '../service/mapModelToResponse.service'
import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'
import { GetDecisionsListResponse } from '../infrastructure/controllers/responses/getDecisionsListResponse'

export class ListDecisionsUsecase {
  constructor(private mongoRepository: IDatabaseRepository) {}

  async execute(
    decisionSearchCriteria: DecisionSearchCriteria
  ): Promise<GetDecisionsListResponse[]> {
    const decisionDTO = mapDecisionSearchCriteriaToDTO(decisionSearchCriteria)
    const decisionsList = await this.mongoRepository.list(decisionDTO)

    return new MapModelToResponseService().mapGetDecisionsListModelToResponse(decisionsList)
  }
}
