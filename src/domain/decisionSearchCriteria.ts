import { GetDecisionsListDto } from '../infrastructure/dto/getDecisionsList.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsString, Matches } from 'class-validator'
import { MockUtils } from '../infrastructure/utils/mock.utils'
import { LabelStatus, Sources } from 'dbsder-api-types'

const mockUtils = new MockUtils()
export class DecisionSearchCriteria {
  @ApiProperty({
    description: 'Source de la décision',
    type: String,
    example: mockUtils.decisionCAToBeTreated.source
  })
  @IsEnum(Sources)
  source: Sources

  @ApiProperty({
    description: 'Statut de la décision',
    enum: LabelStatus,
    example: mockUtils.decisionCAToBeTreated.status
  })
  @IsEnum(LabelStatus)
  status: LabelStatus

  @ApiProperty({
    description: 'Date de début de la décision',
    example: mockUtils.decisionCAToBeTreated.dateCreation
  })
  @IsString()
  @Matches('^(?:[0-9]{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])$')
  @IsDateString()
  startDate: string

  @ApiProperty({
    description: 'Date de fin de la décision',
    example: mockUtils.decisionCAToBeTreated.dateCreation
  })
  @IsString()
  @Matches('^(?:[0-9]{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])$')
  @IsDateString()
  endDate: string
}

export function mapDecisionSearchCriteriaToDTO(
  decisionSearchCriteria: DecisionSearchCriteria
): GetDecisionsListDto {
  return {
    source: decisionSearchCriteria.source,
    status: decisionSearchCriteria.status,
    startDate: decisionSearchCriteria.startDate,
    endDate: decisionSearchCriteria.endDate
  }
}
