import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { PublishStatus } from 'dbsder-api-types'

export class UpdateDecisionPseudonymiseeUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository) {}

  async execute(
    decisionId: string,
    decisionPseudonymisee: string,
    publishStatus: PublishStatus
  ): Promise<string> {
    return this.decisionsRepository.updateDecisionPseudonymisee(
      decisionId,
      decisionPseudonymisee,
      publishStatus
    )
  }
}
