import { DecisionStatus } from './enum'

export class GetDecisionListDTO {
  id: string

  source: string

  status: DecisionStatus

  dateCreation: string
}
