import { LabelStatus, PublishStatus } from 'dbsder-api-types'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { LabelTreatmentDto } from '../infrastructure/dto/updateDecision.dto'
import { DecisionNotFoundError } from '../domain/errors/decisionNotFound.error'

export class UpdateDecisionPseudonymiseeUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository) {}

  async execute(
    decisionId: string,
    pseudoText: string,
    labelTreatments: LabelTreatmentDto[]
  ): Promise<string> {
    const originalDecision = await this.decisionsRepository.getById(decisionId)
    if (!originalDecision) {
      throw new DecisionNotFoundError()
    }

    const labelStatus = LabelStatus.DONE

    const publishStatus =
      originalDecision.publishStatus === PublishStatus.BLOCKED
        ? PublishStatus.BLOCKED
        : PublishStatus.TOBEPUBLISHED

    const updatedLabelTreatments = originalDecision.labelTreatments?.length
      ? [
          ...originalDecision.labelTreatments,
          ...labelTreatments.map((labelTreatment) => ({
            ...labelTreatment,
            order: labelTreatment.order + originalDecision.labelTreatments.length
          }))
        ]
      : labelTreatments

    return this.decisionsRepository.updateDecisionPseudonymisee(
      decisionId,
      pseudoText,
      updatedLabelTreatments,
      labelStatus,
      publishStatus
    )
  }
}
