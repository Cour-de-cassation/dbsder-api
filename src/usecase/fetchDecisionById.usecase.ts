import { DecisionNotFoundError } from '../domain/errors/decisionNotFound.error'
import { MapModelToResponseService } from '../service/mapModelToResponse.service'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { GetDecisionByIdResponse } from '../infrastructure/controllers/responses/getDecisionById.response'

export class FetchDecisionByIdUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository, private mapModelToResponseService: MapModelToResponseService) {
  }

  async execute(id: string): Promise<GetDecisionByIdResponse> {
    const decision = await this.decisionsRepository.getById(id)
    if (!decision) {
      throw new DecisionNotFoundError()
    }
    return this.mapModelToResponseService.mapGetDecisionByIdToResponse(decision)
  }
}
