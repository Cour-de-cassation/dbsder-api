import { Sources } from 'dbsder-api-types'

export class FindDecisionRouteUseCase {
  async execute(codeNac: string, codeDecision: string, source: Sources): Promise<string> {
    return 'test'
  }
}
