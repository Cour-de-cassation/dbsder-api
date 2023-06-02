import { ApiProperty } from '@nestjs/swagger'
import { DecisionStatus } from './enum'
import { MockUtils } from '../infrastructure/utils/mock.utils'

const mockUtils = new MockUtils()
export class GetDecisionListDTO {
  @ApiProperty({
    description: 'Identifiant de la décision',
    type: String,
    example: mockUtils.decisionCAToBeTreated.id
  })
  id: string

  @ApiProperty({
    description: 'Source de la décision',
    type: String,
    example: mockUtils.decisionCAToBeTreated.source
  })
  source: string

  @ApiProperty({
    description: 'Statut de la décision',
    enum: DecisionStatus,
    example: mockUtils.decisionCAToBeTreated.status
  })
  status: DecisionStatus

  @ApiProperty({
    description: 'Date de création (date de réception) de la décision',
    type: String,
    example: mockUtils.decisionCAToBeTreated.dateCreation
  })
  dateCreation: string
}
