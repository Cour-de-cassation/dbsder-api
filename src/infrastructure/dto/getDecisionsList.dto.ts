import { LabelStatus, Sources } from 'dbsder-api-types'
import { DateType } from '../utils/dateType.utils'

export class GetDecisionsListDto {
  sourceName?: Sources

  status?: LabelStatus

  startDate?: string

  endDate?: string

  number?: string

  sourceId?: number

  chamber?: string

  jurisdiction?: string

  dateType?: DateType
}
