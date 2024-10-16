import { Sources } from 'dbsder-api-types'
import { CodeDecisionRepository } from 'src/infrastructure/db/repositories/codeDecision.repository'
import { CodeNACsRepository } from 'src/infrastructure/db/repositories/codeNACs.repository'

export class FindDecisionRouteUseCase {
  constructor(
    private codeNACsRepository: CodeNACsRepository,
    private codeDecisionRepository: CodeDecisionRepository
  ) {}

  async execute(codeNac: string, codeDecision: string, source: Sources): Promise<string> {
    const givenCodeNAC = await this.codeNACsRepository.getByCodeNac(codeNac)
    const givenCodeDecision = await this.codeDecisionRepository.getByCodeDecision(codeDecision)

    if (givenCodeDecision && givenCodeDecision.overwritesNAC) {
      switch (source) {
        case Sources.TJ:
          return givenCodeDecision.routeTJ.toLocaleLowerCase()
        case Sources.CA:
        default:
          return givenCodeDecision.routeCA.toLocaleLowerCase()
      }
    } else if (givenCodeNAC) {
      return givenCodeNAC.routeRelecture.toLocaleLowerCase()
    } else {
      return undefined
    }
  }
}
