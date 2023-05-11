import { createDecisionDTO } from './createDecision.dto'

export class createDecisionCCDTO extends createDecisionDTO {
  NACCode: string
  NPCode: string
  endCaseCode: string
}
