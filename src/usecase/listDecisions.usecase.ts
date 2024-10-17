import {
  DecisionSearchCriteria,
  mapDecisionSearchCriteriaToDTO
} from '../domain/decisionSearchCriteria'
import { MapModelToResponseService } from '../service/mapModelToResponse.service'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { GetDecisionsListResponse } from '../infrastructure/controllers/responses/getDecisionsList.response'

export class ListDecisionsUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository) {}

  async execute(
    decisionSearchCriteria: DecisionSearchCriteria
  ): Promise<GetDecisionsListResponse[]> {
    console.log(decisionSearchCriteria);
    const decisionDTO = mapDecisionSearchCriteriaToDTO(decisionSearchCriteria)
    console.log(decisionDTO)
    const decisionsList = await this.decisionsRepository.list(decisionDTO)

    return new MapModelToResponseService().mapGetDecisionsListModelToResponse(decisionsList)
  }
}
