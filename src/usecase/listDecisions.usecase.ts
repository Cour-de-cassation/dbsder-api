import {
  DecisionSearchCriteria,
  mapDecisionSearchCriteriaToDTO
} from '../domain/decisionSearchCriteria'
import { MapModelToResponseService } from '../service/mapModelToResponse.service'
import { InterfaceDecisionsRepository } from '../infrastructure/db/decisions.repository.interface'
import { GetDecisionsListResponse } from '../infrastructure/controllers/responses/getDecisionsListResponse'

export class ListDecisionsUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository) {}

  async execute(
    decisionSearchCriteria: DecisionSearchCriteria
  ): Promise<GetDecisionsListResponse[]> {
    const decisionDTO = mapDecisionSearchCriteriaToDTO(decisionSearchCriteria)
    const decisionsList = await this.decisionsRepository.list(decisionDTO)

    return new MapModelToResponseService().mapGetDecisionsListModelToResponse(decisionsList)
  }
}
