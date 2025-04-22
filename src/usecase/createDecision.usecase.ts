import { CreateDecisionDTO } from '../infrastructure/dto/createDecision.dto'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { CodeNACsRepository } from '../infrastructure/db/repositories/codeNACs.repository'
import { LabelStatus, Sources, Zoning } from 'dbsder-api-types'
import { ZoningApiService } from '../service/zoningApi.service'
import { computeLabelStatus } from '../domain/business-rules/computeLabelStatus.rules'
import { computePublishStatus } from '../domain/business-rules/computePublishStatus.rules'
import { Logger } from '@nestjs/common'

export class CreateDecisionUsecase {
  constructor(
    private decisionsRepository: InterfaceDecisionsRepository,
    private codeNACsRepository: CodeNACsRepository,
    private zoningApiService: ZoningApiService,
    private readonly logger: Logger = new Logger()
  ) {}

  async execute(decision: CreateDecisionDTO): Promise<string> {
    try {
      const decisionZoning: Zoning = await this.zoningApiService.getDecisionZoning(decision)
      decision.originalTextZoning = decisionZoning
    } catch (error) {
      this.logger.error({
        operationName: 'CreateDecision',
        msg: `Error while calling zoning.`,
        data: error
      })
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
    }

    decision.publishStatus = computePublishStatus(decision)

    return this.decisionsRepository.create(decision)
  }
}
