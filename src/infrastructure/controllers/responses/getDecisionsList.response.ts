import { ApiProperty } from '@nestjs/swagger'
import { LabelStatus, Sources } from 'dbsder-api-types'
import { MockUtils } from '../../utils/mock.utils'

const mockUtils = new MockUtils()
export class GetDecisionsListResponse {
  @ApiProperty({
    description: 'Identifiant de la décision',
    example: mockUtils.decisionTJToBeTreated._id
  })
  _id: string

  @ApiProperty({
    description: 'Statut de la décision',
    example: mockUtils.decisionTJToBeTreated.status
  })
  status: LabelStatus

  @ApiProperty({
    description: 'Source de la décision',
    example: mockUtils.decisionTJToBeTreated.source
  })
  source: Sources

  @ApiProperty({
    description: 'Date de création de la décision au format ISO 8601',
    example: mockUtils.decisionTJToBeTreated.dateCreation
  })
  dateCreation: string
}
