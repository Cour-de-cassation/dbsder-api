import { RapportOccultation } from '../infrastructure/dto/updateDecision.dto'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { LabelStatus, PublishStatus } from 'dbsder-api-types'

export class UpdateRapportsOccultationsUsecase {
  constructor(private decisionsRepository: InterfaceDecisionsRepository) {
  }

  async execute(decisionId: string, rapportsOccultations: RapportOccultation[], publishStatus: PublishStatus, labelStatus: LabelStatus): Promise<string> {
    return this.decisionsRepository.updateRapportsOccultations(decisionId, rapportsOccultations,publishStatus,labelStatus)
  }
}
