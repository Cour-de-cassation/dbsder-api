import { CreateDecisionDTO } from '../infrastructure/dto/createDecision.dto'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { CodeNACsRepository } from '../infrastructure/db/repositories/codeNACs.repository'
import { LabelStatus, Sources, Zoning } from 'dbsder-api-types'
import { ZoningApiService } from '../service/zoningApi.service'
import { computeLabelStatus } from '../infrastructure/utils/computeLabelStatus.utils'

export class CreateDecisionUsecase {
  constructor(
    private decisionsRepository: InterfaceDecisionsRepository,
    private codeNACsRepository: CodeNACsRepository,
    private zoningApiService: ZoningApiService
  ) {}

  async execute(decision: CreateDecisionDTO): Promise<string> {    
    try {
      const decisionZoning: Zoning = await this.zoningApiService.getDecisionZoning(decision)
      decision.originalTextZoning = decisionZoning
    } catch (error) {
      throw new Error(error)
    }

    if (Sources.TJ) {
      // new filter for the new logique
      const detailsCodeNAC = await this.codeNACsRepository.getByCodeNac(decision.NACCode)
      const result = computeLabelStatus(decision, '', detailsCodeNAC)
      decision.labelStatus = result
    }

    if (
      decision.sourceName === Sources.TJ &&
      decision.NACCode &&
      decision.labelStatus === LabelStatus.TOBETREATED
    ) {
      const givenCodeNAC = await this.codeNACsRepository.getByCodeNac(decision.NACCode)

      if (givenCodeNAC !== null) {
        decision.occultation.categoriesToOmit =
          givenCodeNAC?.categoriesToOmitTJ[decision.recommandationOccultation.toString()]
        decision.blocOccultation = givenCodeNAC?.blocOccultationTJ
      } else {
        decision.labelStatus = LabelStatus.IGNORED_CODE_NAC_INCONNU
      }
    }

    return this.decisionsRepository.create(decision)
  }
}
