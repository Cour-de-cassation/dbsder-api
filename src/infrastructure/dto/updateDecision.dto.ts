import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator'
import { MockUtils } from '../utils/mock.utils'
import { Type } from 'class-transformer'
import { Annotation, LabelStatus, LabelTreatment, Check } from 'dbsder-api-types'

const mockUtils = new MockUtils()

export class UpdateDecisionStatutDTO {
  @ApiProperty({
    description: 'Statut de la décision dans Judilibre',
    enum: LabelStatus,
    example: mockUtils.createDecisionDTO.labelStatus
  })
  @IsEnum(LabelStatus)
  statut: LabelStatus
}

export class UpdateDecisionPseudonymiseeDTO {
  @ApiProperty({
    description: 'Texte pseudonymisé de la décision',
    type: String,
    example: mockUtils.decisionPseudonymisee.pseudoText
  })
  @IsString()
  pseudoText: string

  @ApiProperty({
    description: `Label treatments de la décision`,
    example: [mockUtils.labelTreatment],
    type: () => [LabelTreatmentDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LabelTreatmentDto)
  labelTreatments: LabelTreatmentDto[]
}

export class LabelTreatmentDto {
  @ApiProperty({
    description: 'Liste des annotations',
    type: () => [AnnotationDto],
    example: mockUtils.labelTreatment.annotations
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnotationDto)
  annotations: Annotation[]

  @ApiProperty({
    description: 'Source du traitement',
    type: String,
    example: mockUtils.labelTreatment.source
  })
  @IsString()
  source: string

  @ApiProperty({
    description: 'Ordre du traitement',
    type: Number,
    example: mockUtils.labelTreatment.order
  })
  @IsNumber()
  order: number

  @ApiPropertyOptional({
    description: 'Version utilisées pour créer le traitement',
    type: Object,
    example: mockUtils.labelTreatment.version
  })
  version?: LabelTreatment['version']

  @ApiPropertyOptional({
    description: 'Date du traitement',
    type: String,
    example: mockUtils.labelTreatment.treatmentDate
  })
  treatmentDate?: string

  @ApiPropertyOptional({
    description: 'Checklist',
    type: Object,
    example: mockUtils.labelTreatment.checklist
  })
  checklist?: Check[]
}

export class AnnotationDto {
  @ApiProperty({
    description: "Categorie de l'annotation",
    type: String,
    example: mockUtils.labelTreatment
  })
  @IsString()
  category: string

  @ApiProperty({
    description: `ID de l'entité`,
    type: String,
    example: mockUtils.labelTreatment.annotations[0].entityId
  })
  @IsString()
  entityId: string

  @ApiProperty({
    description: 'Démarre à la position',
    type: Number,
    example: mockUtils.labelTreatment.annotations[0].start
  })
  @IsNumber()
  start: number

  @ApiProperty({
    description: "Texte de l'annotation",
    type: String,
    example: mockUtils.labelTreatment.annotations[0].text
  })
  @IsString()
  text: string

  @ApiProperty({
    description: 'Score de certitude',
    type: Number,
    example: mockUtils.labelTreatment.annotations[0].score
  })
  @IsNumber()
  score: number

  @ApiProperty({
    description: 'Source',
    type: String,
    example: mockUtils.labelTreatment.annotations[0].source
  })
  source: string
}
