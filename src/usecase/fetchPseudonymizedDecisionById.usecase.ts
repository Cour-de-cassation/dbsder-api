import { DecisionNotFoundError } from '../domain/errors/decisionNotFound.error'
import { MapModelToResponseService } from '../service/mapModelToResponse.service'
import { InterfaceDecisionsRepository } from '../infrastructure/db/decisions.repository.interface'
import { GetPseudonymizedDecisionByIdResponse } from '../infrastructure/controllers/responses/getPseudonymizedDecisionById.response'

export class FetchPseudonymizedDecisionByIdUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository) {}

  async execute(
    id: string,
    withPersonalData: boolean
  ): Promise<GetPseudonymizedDecisionByIdResponse> {
    const decision = await this.decisionsRepository.getById(id)
    if (!decision) {
      throw new DecisionNotFoundError()
    }
    const decisionPseudonymized =
      await new MapModelToResponseService().mapGetPseudonymizedDecisionByIdToResponse(decision)
    if (withPersonalData) {
      return decisionPseudonymized
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (({ analysis, occultation, pseudoText, ...decision }) => decision)(decisionPseudonymized)
  }
}
