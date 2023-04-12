import { DecisionDTO } from '../../domain/decision.dto'
import { DecisionStatus } from '../../domain/enum'

export class MockUtils {
  decision: DecisionDTO = {
    dateCreation: '2023-04-11',
    id: 'id2023',
    source: 'TJ',
    status: DecisionStatus.TOBEPUBLISHED
  }
}
