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
    if (
      decision.sourceName === Sources.TJ &&
      decision.NACCode &&
      decision.labelStatus === LabelStatus.TOBETREATED
    ) {
      const givenCodeNAC = await this.codeNACsRepository.getByCodeNac(decision.NACCode)

      if (givenCodeNAC !== null) {
        console.log('givenCodeNAC for ' + decision.NACCode + ' is')
        console.log(givenCodeNAC)
        decision.occultation.categoriesToOmit =
          givenCodeNAC.categoriesToOmitTJ[decision.recommandationOccultation.toString()]

        decision.blocOccultation = givenCodeNAC.blocOccultationTJ
      } else {
        console.log('givenCodeNAC for ' + decision.NACCode + ' is null')
        decision.labelStatus = LabelStatus.IGNORED_CODE_NAC_INCONNU
      }
    }

    return this.decisionsRepository.create(decision)
  }
}
