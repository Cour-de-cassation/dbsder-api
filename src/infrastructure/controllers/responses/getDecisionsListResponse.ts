import { DecisionStatus, Sources } from '../../../domain/enum'

export interface GetDecisionsListResponse {
  idDecision: string
  labelStatus: DecisionStatus
  source: Sources
  dateStart: string
  dateEnd: string
}
