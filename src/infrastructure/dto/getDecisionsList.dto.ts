import { DecisionStatus, Sources } from '../../domain/enum'

export class GetDecisionsListDto {
  source: Sources

  status: DecisionStatus

  startDate: string

  endDate: string
}
