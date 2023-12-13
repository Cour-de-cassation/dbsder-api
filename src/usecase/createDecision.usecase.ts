import { CreateDecisionDTO } from '../infrastructure/dto/createDecision.dto'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { CodeNACsRepository } from '../infrastructure/db/repositories/codeNACs.repository'
import { LabelStatus, Sources } from 'dbsder-api-types'

export class CreateDecisionUsecase {
  constructor(
    private decisionsRepository: InterfaceDecisionsRepository,
    private codeNACsRepository: CodeNACsRepository
  ) {}

  async execute(decision: CreateDecisionDTO): Promise<string> {
    const labelStatusNonPublic = [
      LabelStatus.IGNORED_DECISION_NON_PUBLIQUE,
      LabelStatus.IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE
    ]
    if (
      decision.sourceName === Sources.TJ &&
      decision.NACCode &&
      !labelStatusNonPublic.includes(decision.labelStatus)
    ) {
      const givenCodeNAC = await this.codeNACsRepository.getByCodeNac(decision.NACCode)

      if (givenCodeNAC !== null) {
        decision.occultation.categoriesToOmit =
          givenCodeNAC.categoriesToOmitTJ[decision.recommandationOccultation.toString()]

        decision.blocOccultation = givenCodeNAC.blocOccultationTJ
      } else {
        decision.labelStatus = LabelStatus.IGNORED_CODE_NAC_INCONNU
      }
    }

    return this.decisionsRepository.create(decision)
  }
}
