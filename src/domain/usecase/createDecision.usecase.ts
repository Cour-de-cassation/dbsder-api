import { CreateDecisionDTO } from '../createDecisionDTO'

export class CreateDecisionUsecase {
  execute(decision: CreateDecisionDTO): string {
    return 'executed'
  }
}
