import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  DecisionAnalyse,
  DecisionAssociee,
  DecisionOccultation,
  LabelStatus,
  LabelTreatment,
  Occultation,
  PartieTJ,
  President,
  Sources
} from 'dbsder-api-types'
import { MockUtils } from '../../utils/mock.utils'

const mockUtils = new MockUtils()
export class GetDecisionByIdResponse {
  @ApiProperty({
    description: 'Identifiant de la décision',
    example: mockUtils.createDecisionDTO._id
  })
  _id: string

  @ApiPropertyOptional({
    description: 'Analyse de la décision',
    example: mockUtils.createDecisionDTO.analysis
  })
  analysis?: DecisionAnalyse

  @ApiProperty({
    description: 'Liste des pourvois',
    example: mockUtils.createDecisionDTO.appeals
  })
  appeals: string[]

  @ApiProperty({
    description: 'Identifiant de la chambre',
    example: mockUtils.createDecisionDTO.chamberId
  })
  chamberId: string

  @ApiProperty({
    description: 'Nom de la chambre',
    example: mockUtils.createDecisionDTO.chamberName
  })
  chamberName: string

  @ApiProperty({
    description: 'Date de création de la décision au format ISO 8601',
    example: mockUtils.createDecisionDTO.dateCreation
  })
  dateCreation: string

  @ApiProperty({
    description: 'Date de la décision au format AAAA-MM-JJ',
    example: mockUtils.createDecisionDTO.dateDecision
  })
  dateDecision: string

  @ApiPropertyOptional({
    description:
      "Décision attaquée : une décision de la Cour de cassation qui attaque une décision de cour d'appel",
    example: mockUtils.createDecisionDTO.decatt
  })
  decatt?: number[]

  @ApiProperty({
    description: 'Code de la juridiction',
    example: mockUtils.createDecisionDTO.jurisdictionCode
  })
  jurisdictionCode: string

  @ApiProperty({
    description: 'Identifiant de la juridiction',
    example: mockUtils.createDecisionDTO.jurisdictionId
  })
  jurisdictionId: string

  @ApiProperty({
    description: 'Nom de la juridiction',
    example: mockUtils.createDecisionDTO.jurisdictionName
  })
  jurisdictionName: string

  @ApiProperty({
    description: 'Statut interne de la décision',
    example: mockUtils.createDecisionDTO.labelStatus
  })
  labelStatus: LabelStatus

  @ApiPropertyOptional({
    description:
      "Instruction d'occultation de la décision (champ non communiqué pour les décisions pseudonymisées)",
    example: mockUtils.createDecisionDTO.occultation
  })
  occultation?: DecisionOccultation // champ non communiqué pour les décisions pseudonymisées

  @ApiProperty({
    description:
      'Texte original de la décision (champ non communiqué pour les décisions pseudonymisées)',
    example: mockUtils.createDecisionDTO.originalText
  })
  originalText?: string // champ non communiqué pour les décisions pseudonymisées

  @ApiPropertyOptional({
    description: 'Statut de la décision pseudonymisée',
    example: ''
  })
  pseudoStatus?: string

  @ApiPropertyOptional({
    description: 'Texte pseudonymisé de la décision',
    example: 'texte pseudonymisé'
  })
  pseudoText?: string

  @ApiProperty({
    description: 'Indicateur de décision publique ',
    example: true
  })
  public?: boolean

  @ApiProperty({
    description: 'Numéro de registre de la décision',
    example: mockUtils.createDecisionDTO.registerNumber
  })
  registerNumber: string

  @ApiPropertyOptional({
    description: 'Solution de la décision',
    example: mockUtils.createDecisionDTO.solution
  })
  solution?: string

  @ApiProperty({
    description: 'Identifiant de la décision depuis la source',
    example: mockUtils.createDecisionDTO.sourceId
  })
  sourceId: number

  @ApiProperty({
    description: 'Nom de la source de la décision',
    example: mockUtils.createDecisionDTO.sourceName
  })
  sourceName: Sources

  @ApiProperty({
    description: "Données pour la mise en page d'une décision",
    example: mockUtils.createDecisionDTO.sourceName
  })
  zoning?: object

  @ApiPropertyOptional({
    description: 'Propriété interne nécessaire à la publication des décisions',
    example: mockUtils.createDecisionDTO.publication
  })
  publication?: string[]

  @ApiPropertyOptional({
    description: 'Propriété interne nécessaire à la publication des décisions',
    example: mockUtils.createDecisionDTO.formation
  })
  formation?: string

  @ApiProperty({
    description: "Bloc d'occultation à respecter pour la décision",
    example: mockUtils.createDecisionDTO.blocOccultation
  })
  blocOccultation: number

  @ApiPropertyOptional({
    description: 'Cour de cassation : circuit de relecture',
    example: mockUtils.createDecisionTJDto.NAOCode
  })
  NAOCode?: string

  @ApiPropertyOptional({
    description: 'Cour de cassation : circuit de relecture',
    example: mockUtils.createDecisionTJDto.natureAffaireCivil
  })
  natureAffaireCivil?: string

  @ApiPropertyOptional({
    description: 'Cour de cassation : circuit de relecture',
    example: mockUtils.createDecisionTJDto.natureAffairePenal
  })
  natureAffairePenal?: string

  @ApiPropertyOptional({
    description: 'Cour de cassation : circuit de relecture',
    example: mockUtils.createDecisionTJDto.codeMatiereCivil
  })
  codeMatiereCivil?: string

  @ApiPropertyOptional({
    description: 'Cour de cassation : circuit de relecture'
  })
  NACCode?: string

  @ApiPropertyOptional({
    description: 'Code de nature particulière'
  })
  NPCode?: string

  @ApiPropertyOptional({
    description: "Code de fin d'affaire"
  })
  endCaseCode?: string

  @ApiPropertyOptional({
    description: 'Nom du fichier source de la décision'
  })
  filenameSource?: string

  @ApiPropertyOptional({
    description: 'Résumé des traitements Label de la décision'
  })
  labelTreatments?: LabelTreatment[]

  @ApiPropertyOptional({
    description: 'Liste des parties de la décision'
  })
  parties?: PartieTJ[] | object

  @ApiPropertyOptional({
    description: 'Catégorie de publication de la décision'
  })
  pubCategory?: string

  @ApiPropertyOptional({
    description: 'Code de la décision',
    example: mockUtils.createDecisionTJDto.codeDecision
  })
  codeDecision?: string

  @ApiPropertyOptional({
    description: 'Code de la nature de la décision',
    example: mockUtils.createDecisionTJDto.codeNature
  })
  codeNature?: string

  @ApiPropertyOptional({
    description: 'Identifiant du service de la juridiction',
    example: mockUtils.createDecisionTJDto.codeService
  })
  codeService?: string

  @ApiPropertyOptional({
    description: 'Indicateur de débat public de la décision',
    example: mockUtils.createDecisionTJDto.debatPublic
  })
  debatPublic?: boolean

  @ApiPropertyOptional({
    description: 'Décision Associée'
  })
  decisionAssociee?: DecisionAssociee

  @ApiPropertyOptional({
    description: 'Indicateur QPC de décision ',
    example: mockUtils.createDecisionTJDto.indicateurQPC
  })
  indicateurQPC?: boolean

  @ApiPropertyOptional({
    description: 'Identifiant de la décision Winci'
  })
  idDecisionWinci?: string

  @ApiPropertyOptional({
    description: 'Libellé du code décision',
    example: mockUtils.createDecisionTJDto.libelleCodeDecision
  })
  libelleCodeDecision?: string

  @ApiPropertyOptional({
    description: 'Libellé du code NAC',
    example: mockUtils.createDecisionTJDto.libelleNAC
  })
  libelleNAC?: string

  @ApiPropertyOptional({
    description: 'Libellé de la nature particulière',
    example: mockUtils.createDecisionTJDto.libelleNatureParticuliere
  })
  libelleNatureParticuliere?: string

  @ApiPropertyOptional({
    description: 'Libellé du service',
    example: mockUtils.createDecisionTJDto.libelleService
  })
  libelleService?: string

  @ApiPropertyOptional({
    description: 'Indicateur de matière déterminée',
    example: mockUtils.createDecisionTJDto.matiereDeterminee
  })
  matiereDeterminee?: boolean

  @ApiPropertyOptional({
    description: 'Numéro de rôle général',
    example: mockUtils.createDecisionTJDto.numeroRoleGeneral
  })
  numeroRoleGeneral?: string

  @ApiPropertyOptional({
    description: 'Indicateur de pourvoi en cassation',
    example: mockUtils.createDecisionTJDto.pourvoiCourDeCassation
  })
  pourvoiCourDeCassation?: boolean

  @ApiPropertyOptional({
    description: 'Indicateur de pourvoi local',
    example: mockUtils.createDecisionTJDto.pourvoiLocal
  })
  pourvoiLocal?: boolean

  @ApiPropertyOptional({
    description: 'Président de chambre de la décision'
  })
  president?: President

  @ApiPropertyOptional({
    description: "Recommandation d'occultation",
    example: mockUtils.createDecisionTJDto.recommandationOccultation
  })
  recommandationOccultation?: Occultation

  @ApiPropertyOptional({
    description: 'Résumé de la décision'
  })
  sommaire?: string

  @ApiPropertyOptional({
    description: 'Indicateur de sélection',
    example: mockUtils.createDecisionTJDto.selection
  })
  selection?: boolean
}
