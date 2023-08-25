import { LabelStatus, Sources } from 'dbsder-api-types'
export interface GetDecisionsListResponse {
  _id: string
  status: LabelStatus
  source: Sources
  dateCreation: string
}
