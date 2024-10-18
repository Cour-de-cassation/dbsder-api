import { LabelStatus, Sources } from 'dbsder-api-types'

export class GetDecisionsListDto {
  sourceName?: Sources

  status?: LabelStatus

  startDate?: string

  endDate?: string

  dateDecision?: string

  number?: string

  sourceId?: number

  chamber?: string

  jurisdiction?: string
}
