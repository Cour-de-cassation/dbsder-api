import { DecisionStatus, Sources } from '../../../domain/enum'

export interface GetDecisionsListResponse {
  id: string
  status: DecisionStatus
  source: Sources
  dateCreation: string
}
