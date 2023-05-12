import { GetDecisionListDTO } from '../../domain/getDecisionList.dto'
import { DecisionStatus } from '../../domain/enum'

export class MockUtils {
  decisionCCToBeTreated: GetDecisionListDTO = {
    dateCreation: '2023-04-11',
    id: 'id2023',
    source: 'CC',
    status: DecisionStatus.TOBETREATED
  }

  decisionCAToBeTreated: GetDecisionListDTO = {
    dateCreation: '2023-04-11',
    id: 'id2023',
    source: 'CA',
    status: DecisionStatus.TOBETREATED
  }

  decisionTJToBeTreated: GetDecisionListDTO = {
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

  createDecisionDTO = {
    id: 'someID'
  }
}
