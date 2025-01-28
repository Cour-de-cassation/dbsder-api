import { CreateDecisionDTO } from '../infrastructure/dto/createDecision.dto'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { CodeNACsRepository } from '../infrastructure/db/repositories/codeNACs.repository'
import { LabelStatus, PublishStatus, Sources, Zoning } from 'dbsder-api-types'
import { ZoningApiService } from '../service/zoningApi.service'
import { computeLabelStatus } from '../domain/business-rules/computeLabelStatus.rules'
import { computePublishStatus } from '../domain/business-rules/computePublishStatus.rules'
import { isDecisionHasSensitiveChanges } from '../domain/business-rules/isDecisionHasSensitiveChanges.rules'

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

    if (
      decision.sourceName === Sources.TJ &&
      decision.NACCode &&
      decision.labelStatus === LabelStatus.TOBETREATED
    ) {
      const givenCodeNAC = await this.codeNACsRepository.getByCodeNac(decision.NACCode)

      decision.labelStatus = computeLabelStatus(decision, givenCodeNAC)

      if (decision.labelStatus === LabelStatus.TOBETREATED) {
        decision.occultation.categoriesToOmit =
          givenCodeNAC.categoriesToOmitTJ[decision.recommandationOccultation.toString()]

        decision.blocOccultation = givenCodeNAC.blocOccultationTJ
      }

      // Si la décision a déjà été reçue et publiée ne la renvoyer dans label que si les changement de métadonnées sont significatifs
      const currentDecision = await this.decisionsRepository.getBySourceIdAndSourceName(
        decision.sourceId,
        decision.sourceName
      )
      if (currentDecision && currentDecision.publishStatus === PublishStatus.SUCCESS) {
        decision.labelStatus = isDecisionHasSensitiveChanges(currentDecision, decision)
          ? decision.labelStatus
          : LabelStatus.DONE
      }
    }

    decision.publishStatus = computePublishStatus(decision)

    return this.decisionsRepository.create(decision)
  }
}
