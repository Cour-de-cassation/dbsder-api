import { GetDecisionsListDto } from '../infrastructure/dto/getDecisionsList.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator'
import { MockUtils } from '../infrastructure/utils/mock.utils'
import { LabelStatus, Sources } from 'dbsder-api-types'

const mockUtils = new MockUtils()
export class DecisionSearchCriteria {
  @ApiPropertyOptional({
    description: 'Source de la décision',
    type: String,
    example: mockUtils.decisionCAToBeTreated.source
  })
  @IsOptional()
  @IsEnum(Sources)
  source?: Sources

  @ApiPropertyOptional({
    description: 'Statut de la décision',
    enum: LabelStatus,
    example: mockUtils.decisionCAToBeTreated.status
  })
  @IsOptional()
  @IsEnum(LabelStatus)
  status?: LabelStatus

  @ApiPropertyOptional({
    description: 'Date de début de la décision',
    example: mockUtils.decisionCAToBeTreated.dateCreation
  })
  @IsOptional()
  @IsString()
  @Matches('^(?:[0-9]{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])$')
  @IsDateString()
  startDate?: string

  @ApiPropertyOptional({
    description: 'Date de fin de la décision',
    example: mockUtils.decisionCAToBeTreated.dateCreation
  })
  @IsOptional()
  @IsString()
  @Matches('^(?:[0-9]{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])$')
  @IsDateString()
  endDate?: string

  @ApiPropertyOptional({
    description: "NumeroRoleGeneral ou d'appel de la décision",
    example: mockUtils.decisionModel.numeroRoleGeneral
  })
  @IsOptional()
  @IsString()
  numero?: string
}

export function mapDecisionSearchCriteriaToDTO(
  decisionSearchCriteria: DecisionSearchCriteria
): GetDecisionsListDto {
  return {
    source: decisionSearchCriteria.source,
    status: decisionSearchCriteria.status,
    startDate: decisionSearchCriteria.startDate,
    endDate: decisionSearchCriteria.endDate,
    number: decisionSearchCriteria.numero
  }
}
