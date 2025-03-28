import { CodeNACsRepository } from 'src/infrastructure/db/repositories/codeNACs.repository'

export class FindDecisionRouteUseCase {
  constructor(private codeNACsRepository: CodeNACsRepository) {}

  async execute(codeNac: string): Promise<string> {
    const givenCodeNAC = await this.codeNACsRepository.getByCodeNac(codeNac)

    if (givenCodeNAC) {
      return givenCodeNAC.routeRelecture.toLocaleLowerCase()
    } else {
      return undefined
    }
  }
}
