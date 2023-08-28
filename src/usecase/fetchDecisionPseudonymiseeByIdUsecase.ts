import { DecisionNotFoundError } from '../domain/errors/decisionNotFound.error'
import { MapModelToResponseService } from '../service/mapModelToResponse.service'
import { InterfaceDecisionsRepository } from '../infrastructure/db/decisions.repository.interface'
import { GetDecisionPseudonymiseeByIdResponse } from '../infrastructure/controllers/responses/getDecisionPseudonymiseeByIdResponse'

export class FetchDecisionPseudonymiseeByIdUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository) {}

  async execute(
    id: string,
    withPersonalData: boolean
  ): Promise<GetDecisionPseudonymiseeByIdResponse> {
    const decision = await this.decisionsRepository.getById(id)
    if (!decision) {
      throw new DecisionNotFoundError()
    }
    const decisionPseudonymisee =
      await new MapModelToResponseService().mapGetDecisionPseudonymiseeByIdToResponse(decision)
    if (withPersonalData) {
      return decisionPseudonymisee
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (({ analysis, occultation, pseudoText, ...decision }) => decision)(decisionPseudonymisee)
  }
}
