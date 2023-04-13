import { DecisionDTO } from '../../domain/decision.dto'
import { DecisionStatus } from '../../domain/enum'

export class MockUtils {
  decisionCCToBeTreated: DecisionDTO = {
    dateCreation: '2023-04-11',
    id: 'id2023',
    source: 'CC',
    status: DecisionStatus.TOBETREATED
  }

  decisionCAToBeTreated: DecisionDTO = {
    dateCreation: '2023-04-11',
    id: 'id2023',
    source: 'CA',
    status: DecisionStatus.TOBETREATED
  }

  decisionTJToBeTreated: DecisionDTO = {
    dateCreation: '2023-04-11',
    id: 'id2023',
    source: 'TJ',
    status: DecisionStatus.TOBETREATED
  }

  allDecisionsToBeTreated = [
    this.decisionCCToBeTreated,
    this.decisionTJToBeTreated,
    this.decisionCAToBeTreated
  ]
}
