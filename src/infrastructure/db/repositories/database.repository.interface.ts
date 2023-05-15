import { CreateDecisionDTO } from '../../../domain/createDecisionDTO'

export interface IDatabaseRepository {
  create(decision: CreateDecisionDTO): Promise<string>
}
