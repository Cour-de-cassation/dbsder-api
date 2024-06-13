import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { MockUtils } from '../utils/mock.utils'
import {
  LabelStatus,
  PublishStatus,
  Occultation,
  LabelTreatment,
  Annotation,
  PartieTJ,
  Sources,
  Zoning
} from 'dbsder-api-types'
import { AnnotationDto } from './updateDecision.dto'

const mockUtils = new MockUtils()

class DecisionAssocieeDto {
  @ApiProperty({
    description: 'Numéro de registre de la décision associée',
    type: String,
    example: mockUtils.decisionAssociee.numeroRegistre
  })
  @IsString()
  @Length(1, 1)
  numeroRegistre: string

  @ApiProperty({
    description:
      'Numéro RG (Rôle Général) du dossier. Année sur deux chiffres séparé par un «/» d’un numéro à cinq chiffres (0 non significatifs présents). Au format : ^[0-9]{2}/[0-9]{5}$',
    type: String,
    example: mockUtils.decisionAssociee.numeroRoleGeneral
  })
  @IsString()
  @Matches('^[0-9]{2}/[0-9]{5}$')
  numeroRoleGeneral: string

  @ApiProperty({
    description:
      'Identifiant de la juridiction émettrice propre au système d’information originel pour la décision associée. Au format ^TJ[0-9]{5}$',
    type: String,
    example: mockUtils.decisionAssociee.idJuridiction
  })
  @IsString()
  @Matches('^TJ[0-9]{5}$')
  idJuridiction: string

  @ApiProperty({
    description: 'Date de la décision associée. Au format AAAAMMJJ',
    type: String,
    example: mockUtils.decisionAssociee.date
  })
  @IsString()
  @Matches('^[0-9]{8}$')
  @IsDateString()
  date: string

  @ApiPropertyOptional({
    description: 'ID de la décision associée provenant de Winci TGI',
    type: String,
    example: 'some-id'
  })
  @IsOptional()
  @IsString()
  idDecisionWinci?: string
}

class PresidentDto {
  @ApiProperty({
    description: 'Fonction du président de jugement',
    type: String,
    example: mockUtils.presidentDtoMock.fonction
  })
  @IsString()
  fonction: string

  @ApiProperty({
    description: 'Nom du président de jugement',
    type: String,
    example: mockUtils.presidentDtoMock.nom
  })
  @IsString()
  nom: string

  @ApiPropertyOptional({
    description: 'Prénom du président de jugement',
    type: String,
    example: mockUtils.presidentDtoMock.prenom
  })
  @IsString()
  @IsOptional()
  prenom?: string

  @ApiPropertyOptional({
    description: 'Civilité du président de jugement',
    type: String,
    example: mockUtils.presidentDtoMock.civilite
  })
  @IsString()
  @IsOptional()
  civilite?: string
}

class LabelTreatmentDto {
  @ApiPropertyOptional({
    description: "Liste d'annotations",
    type: [AnnotationDto],
    example: mockUtils.decisionRapportsOccultations.rapportsOccultations[0].annotations
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnotationDto)
  annotations: Annotation[]

  @ApiProperty({
    description: 'Source',
    type: String,
    example: mockUtils.decisionRapportsOccultations.rapportsOccultations[0].source
  })
  @IsString()
  source: string

  @ApiProperty({
    description: 'Ordre',
    type: Number,
    example: mockUtils.decisionRapportsOccultations.rapportsOccultations[0].order
  })
  @IsNumber()
  order: number
}

export class DecisionOccultation {
  @ApiProperty({
    description: "Termes additionnels à ajouter lors de l'occultation",
    type: String,
    example: mockUtils.createDecisionDTO.occultation.additionalTerms
  })
  @IsString()
  additionalTerms: string

  @ApiProperty({
    description: "Catégories additionnels à omettre lors de l'occultation",
    type: [String],
    example: mockUtils.createDecisionDTO.occultation.categoriesToOmit
  })
  @IsString({ each: true })
  categoriesToOmit: string[]

  @ApiProperty({
    description: 'Booleen permettant de savoir si il faut occulter les motivations de la décision',
    type: Boolean,
    example: mockUtils.createDecisionDTO.occultation.motivationOccultation
  })
  @IsBoolean()
  motivationOccultation: boolean
}

export class DecisionAnalyse {
  @ApiProperty({
    description: "Eléments de titrage et d'analyse complémentaires",
    type: [String],
    example: mockUtils.createDecisionDTO.analysis.analyse
  })
  @IsString({ each: true })
  @IsOptional()
  analyse?: string[]

  @ApiProperty({
    description: 'Doctrine',
    type: String,
    example: mockUtils.createDecisionDTO.analysis.doctrine
  })
  @IsString()
  @IsOptional()
  doctrine?: string

  @ApiProperty({
    description: 'Rapprochements de jurisprudence',
    type: String,
    example: mockUtils.createDecisionDTO.analysis.link
  })
  @IsString()
  @IsOptional()
  link?: string

  @ApiProperty({
    description: "Eléments de titrage et d'analyse complémentaires",
    type: Array,
    example: mockUtils.createDecisionDTO.analysis.reference
  })
  @IsString({ each: true })
  @IsOptional()
  reference?: string[]

  @ApiProperty({
    description: 'Source',
    type: String,
    example: mockUtils.createDecisionDTO.analysis.source
  })
  @IsString()
  @IsOptional()
  source?: string

  @ApiProperty({
    description: 'Résumé de la décision',
    type: String,
    example: mockUtils.createDecisionDTO.analysis.summary
  })
  @IsString()
  @IsOptional()
  summary?: string

  @ApiProperty({
    description: 'Texte(s) visé(s)',
    type: String,
    example: mockUtils.createDecisionDTO.analysis.target
  })
  @IsString()
  @IsOptional()
  target?: string

  @ApiProperty({
    description: 'Eléments de titrage',
    type: [String],
    example: mockUtils.createDecisionDTO.analysis.title
  })
  @IsString({ each: true })
  @IsOptional()
  title?: string[]
}

export class CreateDecisionDTO {
  @ApiProperty({
    description: 'Analyse de la décision',
    type: () => DecisionAnalyse,
    example: mockUtils.createDecisionDTO.analysis
  })
  @IsDefined()
  @IsObject()
  @IsOptional()
  @Type(() => DecisionAnalyse)
  analysis?: DecisionAnalyse

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
  @IsOptional()
  @IsNumber({}, { each: true })
  decatt?: number[]

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
    description: 'Etat du traitement de la décision',
    enum: LabelStatus,
    example: mockUtils.createDecisionDTO.labelStatus
  })
  @IsEnum(LabelStatus)
  labelStatus: LabelStatus

  @ApiProperty({
    description: 'Statut de la publication de la décision sur Judilibre',
    enum: PublishStatus,
    example: mockUtils.createDecisionDTO.publishStatus
  })
  @IsOptional()
  @IsEnum(PublishStatus)
  publishStatus?: PublishStatus

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
    motivationOccultation: boolean
  }

  @ApiProperty({
    description: 'Traitements appliqués par Label',
    type: [LabelTreatmentDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LabelTreatmentDto)
  labelTreatments?: LabelTreatment[]

  @ApiProperty({
    description: 'Le texte original de la décision',
    type: String,
    example: mockUtils.createDecisionDTO.originalText
  })
  @IsString()
  originalText: string

  @ApiProperty({
    description: 'Parties',
    type: [Object],
    example: mockUtils.createDecisionDTO.parties
  })
  parties: PartieTJ[] | object[]

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
  @IsOptional()
  @IsString()
  solution?: string

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
  @IsEnum(Sources)
  sourceName: Sources

  @ApiPropertyOptional({
    description: '(interne) Mise en page des décisions diffusées par extrait',
    type: Object,
    deprecated: true
  })
  @IsObject()
  @IsOptional()
  zoning?: object

  @ApiPropertyOptional({
    description: 'Zonage de la décision sur le texte intègre',
    type: Object,
    example: mockUtils.createDecisionDTO.blocOccultation
  })
  @IsOptional()
  originalTextZoning?: Zoning

  @ApiPropertyOptional({
    description: 'Zonage de la décision sur le texte pseudonymisé',
    type: Object,
    example: mockUtils.createDecisionDTO.blocOccultation
  })
  @IsOptional()
  pseudoTextZoning?: Zoning

  @ApiProperty({
    description:
      'La propriété publication est alimenté par les nouveaux indicateurs positionnés en amont: IND_BULLETIN, IND_RAPPORT, IND_LETTRE et IND_COMMUNIQUE (CC only)',
    type: [String],
    example: mockUtils.createDecisionDTO.publication
  })
  @IsOptional()
  @IsString({ each: true })
  publication?: string[]

  @ApiProperty({
    description:
      'Champ session dans Label :circuit de relecture, pour la Cour de cassation ex: FRR -> formation restreinte',
    type: [String],
    example: mockUtils.createDecisionDTO.formation
  })
  @IsOptional()
  @IsString()
  formation?: string

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
  @IsOptional()
  @IsString()
  NAOCode?: string

  @ApiProperty({
    description: 'Cour de cassation : circuit de relecture',
    type: String
  })
  @IsOptional()
  @IsString()
  natureAffaireCivil?: string

  @ApiProperty({
    description: 'Cour de cassation : circuit de relecture',
    type: String
  })
  @IsOptional()
  @IsString()
  natureAffairePenal?: string

  @ApiProperty({
    description: 'Cour de cassation : circuit de relecture',
    type: String
  })
  @IsOptional()
  @IsString()
  codeMatiereCivil?: string

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
    description: 'CodeDecision/endCaseCode. Au format : ^[0-9a-zA-Z]{3}$',
    type: String,
    example: mockUtils.createDecisionTJDto.endCaseCode
  })
  @IsOptional()
  @IsString()
  @Matches('^[0-9a-zA-Z]{3}$')
  endCaseCode?: string

  @ApiPropertyOptional({
    description: 'Nom du fichier source',
    type: String
  })
  @IsOptional()
  @IsString()
  filenameSource?: string

  @ApiPropertyOptional({
    description: 'Utilisable pour les décisions CC',
    type: String
  })
  @IsOptional()
  @IsString()
  pubCategory?: string

  // TJ VVV

  @ApiPropertyOptional({
    description: 'Identifiant du service de la juridiction. Au format: ^[\\S]{2}$$',
    type: String,
    example: mockUtils.createDecisionTJDto.codeService
  })
  @IsOptional()
  @IsString()
  @Matches('^[\\S]{2}$')
  codeService?: string

  @ApiPropertyOptional({
    description: "Débat public d'une décision",
    type: Boolean,
    example: mockUtils.createDecisionTJDto.debatPublic
  })
  @IsOptional()
  @IsBoolean()
  debatPublic?: boolean

  @ApiPropertyOptional({
    description: 'Décision intègre chainée à la décision',
    type: DecisionAssocieeDto,
    example: mockUtils.decisionAssociee
  })
  @IsOptional()
  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => DecisionAssocieeDto)
  decisionAssociee?: DecisionAssocieeDto

  @ApiPropertyOptional({
    description: 'Libellé du type de décision',
    type: String,
    example: mockUtils.createDecisionTJDto.libelleEndCaseCode
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  libelleEndCaseCode?: string

  @ApiPropertyOptional({
    description: 'Libellé du code NAC de la décision',
    type: String,
    example: mockUtils.createDecisionTJDto.libelleNAC
  })
  @IsOptional()
  @IsString()
  libelleNAC?: string

  @ApiPropertyOptional({
    description: 'Libellé du service de la juridiction',
    type: String,
    example: mockUtils.createDecisionTJDto.libelleService
  })
  @IsOptional()
  @IsString()
  @Length(0, 25)
  libelleService?: string

  @ApiPropertyOptional({
    description: "Matière déterminée d'une décision",
    type: Boolean,
    example: mockUtils.createDecisionTJDto.matiereDeterminee
  })
  @IsOptional()
  @IsBoolean()
  matiereDeterminee?: boolean

  @ApiPropertyOptional({
    description:
      'Numéro RG (Rôle Général) du dossier. Année sur deux chiffres séparé par un «/» d’un numéro à cinq chiffres (0 non significatifs présents). Au format : ^[0-9]{2}/[0-9]{5}$',
    type: String,
    example: mockUtils.decisionAssociee.numeroRoleGeneral
  })
  @IsOptional()
  @IsString()
  @Matches('^[0-9]{2}/[0-9]{5}$')
  numeroRoleGeneral?: string

  @ApiPropertyOptional({
    description: "Pourvoi de Cour de Cassation d'une décision",
    type: Boolean,
    example: mockUtils.createDecisionTJDto.pourvoiCourDeCassation
  })
  @IsOptional()
  @IsBoolean()
  pourvoiCourDeCassation?: boolean

  @ApiPropertyOptional({
    description: "Pourvoi local d'une décision",
    type: Boolean,
    example: mockUtils.createDecisionTJDto.pourvoiLocal
  })
  @IsOptional()
  @IsBoolean()
  pourvoiLocal?: boolean

  @ApiPropertyOptional({
    description: 'Information sur le président de la formation du jugement',
    type: () => PresidentDto,
    example: mockUtils.presidentDtoMock
  })
  @IsDefined()
  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PresidentDto)
  president?: PresidentDto

  /* FIXME: L'enum n'est pas reconnu */
  recommandationOccultation?: Occultation

  @ApiPropertyOptional({
    description: 'Résumé de la décision intègre',
    type: String,
    example: 'Exemple de sommaire'
  })
  @IsString()
  @IsOptional()
  sommaire?: string

  @ApiPropertyOptional({
    description: "Selection d'une décision",
    type: Boolean,
    example: mockUtils.createDecisionTJDto.selection
  })
  @IsOptional()
  @IsBoolean()
  selection?: boolean

  @ApiPropertyOptional({
    description: 'Libellé du code de nature particulière',
    type: String,
    example: mockUtils.createDecisionTJDto.libelleNatureParticuliere
  })
  @IsOptional()
  @IsString()
  libelleNatureParticuliere?: string

  @ApiPropertyOptional({
    description: 'Indicateur QPC',
    type: Boolean,
    example: mockUtils.createDecisionTJDto.indicateurQPC
  })
  @IsOptional()
  @IsBoolean()
  indicateurQPC?: boolean

  @ApiPropertyOptional({
    description: 'ID de la décision provenant de Winci TGI',
    type: String,
    example: 'some-id'
  })
  @IsOptional()
  @IsString()
  idDecisionWinci?: string
}
