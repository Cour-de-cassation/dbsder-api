import { Decision } from 'src/infrastructure/db/models/decision.model'
import { DecisionNotFoundError } from '../domain/errors/decisionNotFound.error'
import { MapModelToResponseService } from '../service/mapModelToResponse.service'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { GetDecisionByIdResponse } from '../infrastructure/controllers/responses/getDecisionById.response'

export class FetchDecisionPseudonymiseeByIdUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository,private mapModelToResponseService: MapModelToResponseService) {
  }

  async execute(id: string, withPersonalData: boolean): Promise<GetDecisionByIdResponse> {
    const decision: Decision = await this.decisionsRepository.getById(id)
    if (!decision) {
      throw new DecisionNotFoundError()
    }
    return await this.mapModelToResponseService.mapGetDecisionPseudonymiseeByIdToResponse(decision, withPersonalData)
  }
}
