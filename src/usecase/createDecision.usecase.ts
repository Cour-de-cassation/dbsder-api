import { CreateDecisionDTO } from '../infrastructure/dto/createDecision.dto'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { CodeNACsRepository } from '../infrastructure/db/repositories/codeNACs.repository'
import { Sources } from 'dbsder-api-types'

export class CreateDecisionUsecase {
  constructor(
    private decisionsRepository: InterfaceDecisionsRepository,
    private codeNACsRepository: CodeNACsRepository
  ) {}

  async execute(decision: CreateDecisionDTO): Promise<string> {
    if (decision.sourceName === Sources.TJ && decision.NACCode) {
      const givenCodeNAC = await this.codeNACsRepository.getByCodeNac(decision.NACCode)

      decision.blocOccultation = givenCodeNAC.blocOccultationTJ

      console.log(decision.recommandationOccultation.toString())

      decision.occultation.categoriesToOmit =
        givenCodeNAC.categoriesToOmitTJ[decision.recommandationOccultation.toString()]
    }
    console.log(decision)

    return this.decisionsRepository.create(decision)
  }
}
