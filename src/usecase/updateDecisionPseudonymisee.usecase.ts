import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { LabelStatus, LabelTreatment, PublishStatus } from 'dbsder-api-types'

export class UpdateDecisionPseudonymiseeUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository) {}

  async execute(decisionId: string, decisionPseudonymisee: string,publishStatus: PublishStatus,labelTreatments: LabelTreatment[],labelStatus: LabelStatus): Promise<string> {
    return this.decisionsRepository.updateDecisionPseudonymisee(decisionId, decisionPseudonymisee,labelTreatments,publishStatus,labelStatus)
  }
}
