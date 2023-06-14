import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'
import { DecisionStatus } from '../domain/enum'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { MockUtils } from './utils/mock.utils'

const mockUtils = new MockUtils()
export class DecisionOccultation {
  @ApiProperty({
    description: "Termes additionnels à ajouter lors de l'occultation",
    type: String,
    example: new MockUtils().createDecisionDTO.occultation.additionalTerms
  })
  @IsString()
  additionalTerms: string

  @ApiProperty({
    description: "Catégories additionnels à omettre lors de l'occultation",
    type: [String],
    example: new MockUtils().createDecisionDTO.occultation.categoriesToOmit
  })
  @IsString({ each: true })
  categoriesToOmit: string[]
}

export class DecisionAnalyse {
  @ApiProperty({
    description: "Eléments de titrage et d'analyse complémentaires",
    type: [String],
    example: mockUtils.createDecisionDTO.analysis.analyse
  })
  @IsString({ each: true })
  analyse: string[]

  @ApiProperty({
    description: 'Doctrine',
    type: String,
    example: mockUtils.createDecisionDTO.analysis.doctrine
  })
  @IsString()
  doctrine: string

  @ApiProperty({
    description: 'Rapprochements de jurisprudence',
    type: String,
    example: mockUtils.createDecisionDTO.analysis.link
  })
  @IsString()
  link: string

  @ApiProperty({
    description: "Eléments de titrage et d'analyse complémentaires",
    type: Array,
    example: mockUtils.createDecisionDTO.analysis.reference
  })
  @IsString({ each: true })
  reference: string[]

  @ApiProperty({
    description: 'Source',
    type: String,
    example: mockUtils.createDecisionDTO.analysis.source
  })
  @IsString()
  source: string

  @ApiProperty({
    description: 'Résumé de la décision',
    type: String,
    example: mockUtils.createDecisionDTO.analysis.summary
  })
  @IsString()
  summary: string

  @ApiProperty({
    description: 'Texte(s) visé(s)',
    type: String,
    example: mockUtils.createDecisionDTO.analysis.target
  })
  @IsString()
  target: string

  @ApiProperty({
    description: 'Eléments de titrage',
    type: [String],
    example: mockUtils.createDecisionDTO.analysis.title
  })
  @IsString({ each: true })
  title: string[]
}

export class CreateDecisionDTO {
  @ApiProperty({
    description: 'Identifiant de la decision',
    type: String,
    example: mockUtils.createDecisionDTO.id
  })
  @IsString()
  id: string

  @ApiProperty({
    description: 'Analyse de la décision',
    type: () => DecisionAnalyse,
    example: mockUtils.createDecisionDTO.analysis
  })
  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => DecisionAnalyse)
  analysis: DecisionAnalyse

  @ApiProperty({
    description: 'Numéro(s) de pourvoi de la décision',
    type: [String],
    example: mockUtils.createDecisionDTO.appeals
  })
  @IsString({ each: true })
  appeals: string[]

  @ApiProperty({
    description: 'Composante de chamberName afin de pouvoir etre lisible pour les agents',
    type: String,
    example: mockUtils.createDecisionDTO.chamberId
  })
  @IsString()
  chamberId: string

  @ApiProperty({
    description:
      "Nom de la chambre à la Cour de cassation, en fonction du niveau de l'affaire ou du thème : 'Chambre sociale','Chambre commerciale',...",
    type: String,
    example: mockUtils.createDecisionDTO.chamberName
  })
  @IsString()
  chamberName: string

  @ApiProperty({
    description: 'Identifiant technique de la décision',
    type: String,
    example: mockUtils.createDecisionDTO.chamberName
  })
  @IsString()
  iddecision: string

  @ApiProperty({
    description: 'Date de la création (après réception) de la décision',
    type: String,
    example: mockUtils.createDecisionDTO.dateCreation
  })
  @IsString()
  dateCreation: string

  @ApiProperty({
    description: 'Date de la décision',
    type: String,
    example: mockUtils.createDecisionDTO.dateDecision
  })
  @IsString()
  dateDecision: string

  @ApiProperty({
    description: 'Décision(s) attaquée(s)',
    type: [Number],
    example: mockUtils.createDecisionDTO.decatt
  })
  @IsNumber({}, { each: true })
  decatt: number[]

  @ApiProperty({
    description: 'Manière de codifier et/ou identifier la juridiction émettrice',
    type: String,
    example: mockUtils.createDecisionDTO.jurisdictionCode
  })
  @IsString()
  jurisdictionCode: string

  @ApiProperty({
    description: 'Manière de codifier et/ou identifier la juridiction émettrice',
    type: String,
    example: mockUtils.createDecisionDTO.jurisdictionId
  })
  @IsString()
  jurisdictionId: string

  @ApiProperty({
    description:
      "le titre de la juridiction. Ex : 'Cour d'appel d'Angers', 'Tribunal judiciaire de Bobigny'",
    type: String,
    example: mockUtils.createDecisionDTO.jurisdictionName
  })
  @IsString()
  jurisdictionName: string

  @ApiProperty({
    description: 'Statut de la décision dans Judilibre',
    enum: DecisionStatus,
    example: mockUtils.createDecisionDTO.labelStatus
  })
  @IsEnum(DecisionStatus)
  labelStatus: DecisionStatus

  @ApiProperty({
    description: 'Statut de la décision dans Judilibre',
    type: DecisionOccultation,
    example: mockUtils.createDecisionDTO.occultation
  })
  @ValidateNested()
  @Type(() => DecisionOccultation)
  occultation: {
    additionalTerms: string
    categoriesToOmit: string[]
  }

  @ApiProperty({
    description: 'Le texte original de la décision',
    type: String,
    example: mockUtils.createDecisionDTO.originalText
  })
  @IsString()
  originalText: string

  @ApiPropertyOptional({
    description: "(interne) L'état de la pseudonymisation",
    type: String
  })
  @IsString()
  @IsOptional()
  pseudoStatus?: string

  @ApiPropertyOptional({
    description: 'Le texte de la décision pseudonymisé',
    type: String
  })
  @IsString()
  @IsOptional()
  pseudoText?: string

  @ApiPropertyOptional({
    description: 'La décision est-elle publique ?',
    type: Boolean
  })
  @IsBoolean()
  @IsOptional()
  public?: boolean

  @ApiProperty({
    description: 'Numéro de registre',
    type: Boolean,
    example: mockUtils.createDecisionDTO.registerNumber
  })
  @IsString()
  registerNumber: string

  @ApiProperty({
    description:
      "Circuit de relecture pour jurinet ex: 'Avis sur saisine', 'Non-admission', 'Déchéance',",
    type: String,
    example: mockUtils.createDecisionDTO.solution
  })
  @IsString()
  solution: string

  @ApiProperty({
    description: 'ID de la décision (ID Oracle)',
    type: Number,
    example: mockUtils.createDecisionDTO.sourceId
  })
  @IsNumber()
  sourceId: number

  @ApiProperty({
    description: "Nom de la source ex : 'jurica', 'jurinet', 'juritj'",
    type: String,
    example: mockUtils.createDecisionDTO.sourceName
  })
  @IsString()
  sourceName: string

  @ApiPropertyOptional({
    description: '(interne) Mise en page des décisions diffusées par extrait',
    type: String,
    example: mockUtils.createDecisionDTO.sourceName
  })
  @IsObject()
  @IsOptional()
  zoning?: object

  @ApiProperty({
    description:
      'La propriété publication est alimenté par les nouveaux indicateurs positionnés en amont: IND_BULLETIN, IND_RAPPORT, IND_LETTRE et IND_COMMUNIQUE (CC only)',
    type: [String],
    example: mockUtils.createDecisionDTO.publication
  })
  @IsString({ each: true })
  publication: string[]

  @ApiProperty({
    description:
      'Champ session dans Label :circuit de relecture, pour la Cour de cassation ex: FRR -> formation restreinte',
    type: [String],
    example: mockUtils.createDecisionDTO.formation
  })
  @IsString()
  formation: string

  @ApiProperty({
    description: "Numéro du bloc d'occultation",
    type: Number,
    example: mockUtils.createDecisionDTO.blocOccultation
  })
  @IsNumber()
  blocOccultation: number

  @ApiProperty({
    description: 'Cour de cassation : circuit de relecture',
    type: String
  })
  @IsString()
  NAOCode: string

  @ApiProperty({
    description: 'Cour de cassation : circuit de relecture',
    type: String
  })
  @IsString()
  natureAffaireCivil: string

  @ApiProperty({
    description: 'Cour de cassation : circuit de relecture',
    type: String
  })
  @IsString()
  natureAffairePenal: string

  @ApiProperty({
    description: 'Cour de cassation : circuit de relecture',
    type: String
  })
  @IsString()
  codeMatiereCivil: string

  @ApiPropertyOptional({
    description: 'Utilisable pour les décisions CC',
    type: String
  })
  @IsOptional()
  @IsString()
  NACCode?: string

  @ApiPropertyOptional({
    description: 'Utilisable pour les décisions CC',
    type: String
  })
  @IsOptional()
  @IsString()
  NPCode?: string

  @ApiPropertyOptional({
    description: 'Utilisable pour les décisions CC',
    type: String
  })
  @IsOptional()
  @IsString()
  endCaseCode?: string
}
