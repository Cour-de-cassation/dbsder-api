import { DecisionNotFoundError } from '../domain/errors/decisionNotFound.error'
import { MapModelToResponseService } from '../service/mapModelToResponse.service'
import { InterfaceDecisionsRepository } from '../infrastructure/db/decisions.repository.interface'
import { GetPseudonymizedDecisionByIdResponse } from '../infrastructure/controllers/responses/getPseudonymizedDecisionById.response'

export class FetchPseudonymizedDecisionByIdUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository) {}

  async execute(id: string): Promise<GetPseudonymizedDecisionByIdResponse> {
    const decision = await this.decisionsRepository.getById(id)
    if (!decision) {
      throw new DecisionNotFoundError()
    }
    return new MapModelToResponseService().mapGetPseudonymizedDecisionByIdToResponse(decision)
  }
}
