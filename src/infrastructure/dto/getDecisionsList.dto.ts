import { LabelStatus, Sources } from 'dbsder-api-types'

export class GetDecisionsListDto {
  source?: Sources

  status?: LabelStatus

  startDate?: string

  endDate?: string

  number?: string
}
