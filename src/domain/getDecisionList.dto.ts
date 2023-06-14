import { ApiProperty } from '@nestjs/swagger'
import { DecisionStatus, Sources } from './enum'
import { MockUtils } from '../infrastructure/utils/mock.utils'
import { IsDateString, IsEnum, IsString, Matches } from 'class-validator'

const mockUtils = new MockUtils()
export class GetDecisionListDTO {
  @ApiProperty({
    description: 'Source de la décision',
    type: String,
    example: mockUtils.decisionCAToBeTreated.source
  })
  @IsEnum(Sources)
  source: Sources

  @ApiProperty({
    description: 'Statut de la décision',
    enum: DecisionStatus,
    example: mockUtils.decisionCAToBeTreated.status
  })
  @IsEnum(DecisionStatus)
  status: DecisionStatus

  @ApiProperty({
    description: 'Date de début de la décision',
    enum: DecisionStatus,
    example: mockUtils.decisionCAToBeTreated.dateCreation
  })
  @IsString()
  @Matches('^(?:[0-9]{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])$')
  @IsDateString()
  startDate: string

  @ApiProperty({
    description: 'Date de fin de la décision',
    enum: DecisionStatus,
    example: mockUtils.decisionCAToBeTreated.dateCreation
  })
  @IsString()
  @Matches('^(?:[0-9]{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])$')
  @IsDateString()
  endDate: string
}
