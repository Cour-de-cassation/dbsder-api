import { DecisionDTO } from '../../domain/decision.dto'
import { DecisionStatus } from '../../domain/enum'

export class MockUtils {
  decisionCCToBePublished: DecisionDTO = {
    dateCreation: '2023-04-11',
    id: 'id2023',
    source: 'CC',
    status: DecisionStatus.TOBEPUBLISHED
  }

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

  decisionTJToBePublished: DecisionDTO = {
    dateCreation: '2023-04-11',
    id: 'id2023',
    source: 'TJ',
    status: DecisionStatus.TOBEPUBLISHED
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
