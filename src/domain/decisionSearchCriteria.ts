import { GetDecisionsListDto } from '../infrastructure/dto/getDecisionsList.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator'
import { MockUtils } from '../infrastructure/utils/mock.utils'
import { LabelStatus, Sources } from 'dbsder-api-types'
import { DateType } from '../infrastructure/utils/dateType.utils'

const mockUtils = new MockUtils()

export class DecisionSearchCriteria {
  @ApiPropertyOptional({
    description: 'Source de la décision',
    type: String,
    example: mockUtils.decisionTJToBeTreated.sourceName
  })
  @IsOptional()
  @IsEnum(Sources)
  sourceName?: Sources

  @ApiPropertyOptional({
    description: 'Statut de la décision',
    enum: LabelStatus,
    example: mockUtils.decisionTJToBeTreated.status
  })
  @IsOptional()
  @IsEnum(LabelStatus)
  status?: LabelStatus

  @ApiPropertyOptional({
    description: 'Date de début de la période de recherche',
    example: '2024-04-24'
  })
  @IsOptional()
  @IsString()
  @Matches('^(?:[0-9]{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])$')
  @IsDateString()
  startDate?: string

  @ApiPropertyOptional({
    description: 'Date de fin de la période de recherche',
    example: '2024-04-24'
  })
  @IsOptional()
  @IsString()
  @Matches('^(?:[0-9]{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])$')
  @IsDateString()
  endDate?: string

  @ApiPropertyOptional({
    description: 'Type de date de décision ou de création',
    enum: DateType,
    example: mockUtils.dateTypeMock.dateType
  })
  @IsOptional()
  @IsEnum(DateType)
  dateType?: DateType

  @ApiPropertyOptional({
    description: "NumeroRoleGeneral ou d'appel de la décision",
    example: mockUtils.decisionModel.numeroRoleGeneral
  })
  @IsOptional()
  @IsString()
  numero?: string

  @ApiPropertyOptional({
    description: 'id de la source de la decision',
    example: mockUtils.decisionModel.sourceId
  })
  @IsOptional()
  @IsString()
  sourceId?: number

  @ApiPropertyOptional({
    description: 'chambre de la decision',
    example: mockUtils.decisionModel.chamberName
  })
  @IsOptional()
  @IsString()
  chamber?: string

  @ApiPropertyOptional({
    description: 'jurisdiction de la decision',
    example: mockUtils.decisionModel.jurisdictionName
  })
  @IsOptional()
  @IsString()
  jurisdiction?: string
}

export function mapDecisionSearchCriteriaToDTO(
  decisionSearchCriteria: DecisionSearchCriteria
): GetDecisionsListDto {
  return {
    sourceName: decisionSearchCriteria.sourceName,
    status: decisionSearchCriteria.status,
    startDate: decisionSearchCriteria.startDate,
    endDate: decisionSearchCriteria.endDate,
    number: decisionSearchCriteria.numero,
    dateType: decisionSearchCriteria.dateType || DateType.DATEDECISION,
    sourceId: decisionSearchCriteria.sourceId,
    chamber: decisionSearchCriteria.chamber,
    jurisdiction: decisionSearchCriteria.jurisdiction
  }
}
