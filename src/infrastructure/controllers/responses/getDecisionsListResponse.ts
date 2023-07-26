import { DecisionStatus, Sources } from '../../../domain/enum'
export interface GetDecisionsListResponse {
  _id: string
  status: DecisionStatus
  source: Sources
  dateCreation: string
}
