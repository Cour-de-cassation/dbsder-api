import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator'
import { MockUtils } from '../utils/mock.utils'
import { DecisionStatus } from '../../domain/enum'
import { Type } from 'class-transformer'

const mockUtils = new MockUtils()

export class UpdateDecisionStatusDTO {
  @ApiProperty({
    description: 'Statut de la décision dans Judilibre',
    enum: DecisionStatus,
    example: mockUtils.createDecisionDTO.labelStatus
  })
  @IsEnum(DecisionStatus)
  statut: DecisionStatus
}

export class UpdateDecisionPseudonymisedDecisionDTO {
  @ApiProperty({
    description: 'Décision pseudonymisée de la décision',
    example: `Texte pseudonymisé d'une décision`
  })
  @IsString()
  decisionPseudonymisee: string
}

export class UpdateDecisionConcealmentReportsDTO {
  @ApiProperty({
    description: `Rapport d'occultations de la décision`,
    type: () => [RapportOccultation],
    example: mockUtils.decisionConcealmentReports.rapportsOccultations
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RapportOccultation)
  rapportsOccultations: RapportOccultation[]
}

export class RapportOccultation {
  @ApiProperty({
    description: 'Annotations',
    type: () => [Annotation],
    example: mockUtils.decisionConcealmentReports.rapportsOccultations[0].annotations
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Annotation)
  annotations: Annotation[]

  @ApiProperty({
    description: 'Source',
    type: String,
    example: mockUtils.decisionConcealmentReports.rapportsOccultations[0].source
  })
  @IsString()
  source: string

  @ApiProperty({
    description: 'Ordre',
    type: Number,
    example: mockUtils.decisionConcealmentReports.rapportsOccultations[0].order
  })
  @IsNumber()
  order: number
}

export class Annotation {
  @ApiProperty({
    description: "Categorie de l'annotation",
    type: String,
    example: mockUtils.decisionConcealmentReports.rapportsOccultations[0].annotations[0].category
  })
  @IsString()
  category: string

  @ApiProperty({
    description: `ID de l'entité`,
    type: String,
    example: mockUtils.decisionConcealmentReports.rapportsOccultations[0].annotations[0].entityId
  })
  @IsString()
  entityId: string

  @ApiProperty({
    description: 'Démarre à la position',
    type: Number,
    example: mockUtils.decisionConcealmentReports.rapportsOccultations[0].annotations[0].start
  })
  @IsNumber()
  start: number

  @ApiProperty({
    description: "Texte de l'annotation",
    type: String,
    example: mockUtils.decisionConcealmentReports.rapportsOccultations[0].annotations[0].text
  })
  @IsString()
  text: string

  @ApiProperty({
    description: 'Score de certitude',
    type: Number,
    example:
      mockUtils.decisionConcealmentReports.rapportsOccultations[0].annotations[0].certaintyScore
  })
  @IsNumber()
  certaintyScore: number
}
