import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNotEmptyObject,
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
import { CreateDecisionDTO } from './createDecision.dto'
import { Occultation } from 'dbsder-api-types'
//import { Occultation } from 'dbsder-api-types'

const mockUtils = new MockUtils()
class DecisionDto {
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
}

class PresidentDto {
  @ApiProperty({
    description: 'Fonction du président de jugement',
    type: String,
    example: new MockUtils().presidentDtoMock.fonction
  })
  @IsString()
  fonction: string

  @ApiProperty({
    description: 'Nom du président de jugement',
    type: String,
    example: new MockUtils().presidentDtoMock.nom
  })
  @IsString()
  nom: string

  @ApiPropertyOptional({
    description: 'Prénom du président de jugement',
    type: String,
    example: new MockUtils().presidentDtoMock.prenom
  })
  @IsString()
  @IsOptional()
  prenom?: string

  @ApiPropertyOptional({
    description: 'Civilité du président de jugement',
    type: String,
    example: new MockUtils().presidentDtoMock.civilite
  })
  @IsString()
  @IsOptional()
  civilite?: string
}

export class CreateDecisionTJDTO extends CreateDecisionDTO {
  @ApiProperty({
    description: 'Code du type de décision. Au format : ^[0-9a-zA-Z]{3}$',
    type: String,
    example: mockUtils.createDecisionTJDto.codeDecision
  })
  @IsString()
  @Matches('^[0-9a-zA-Z]{3}$')
  codeDecision: string

  @ApiProperty({
    description: "Complément d'information du code NAC. Au format : ^[0-9a-zA-Z]{1-2}$",
    type: String,
    example: mockUtils.createDecisionTJDto.codeNature
  })
  @IsString()
  @Matches('^[0-9a-zA-Z]{1,2}$')
  codeNature: string

  @ApiProperty({
    description: 'Identifiant du service de la juridiction. Au format: ^[0-9a-zA-Z]{2}$',
    type: String,
    example: mockUtils.createDecisionTJDto.codeService
  })
  @IsString()
  @Matches('^[0-9a-zA-Z]{2}$')
  codeService: string

  @ApiProperty({
    description: "Débat public d'une décision",
    type: Boolean,
    example: mockUtils.createDecisionTJDto.debatPublic
  })
  @IsBoolean()
  debatPublic: boolean

  @ApiPropertyOptional({
    description: 'Décision intègre chainée à la décision',
    type: DecisionDto,
    example: mockUtils.decisionAssociee
  })
  @IsOptional()
  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => DecisionDto)
  decisionAssociee?: DecisionDto

  @ApiProperty({
    description: 'Libellé du type de décision',
    type: String,
    example: mockUtils.createDecisionTJDto.libelleCodeDecision
  })
  @IsString()
  @Length(0, 200)
  libelleCodeDecision: string

  @ApiProperty({
    description: 'Libellé du code NAC de la décision',
    type: String,
    example: mockUtils.createDecisionTJDto.libelleNAC
  })
  @IsString()
  libelleNAC: string

  @ApiProperty({
    description: 'Libellé du service de la juridiction',
    type: String,
    example: mockUtils.createDecisionTJDto.libelleService
  })
  @IsString()
  @Length(0, 25)
  libelleService: string

  @ApiProperty({
    description: "Matière déterminée d'une décision",
    type: Boolean,
    example: mockUtils.createDecisionTJDto.matiereDeterminee
  })
  @IsBoolean()
  matiereDeterminee: boolean

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
    description: "Pourvoi de Cour de Cassation d'une décision",
    type: Boolean,
    example: mockUtils.createDecisionTJDto.pourvoiCourDeCassation
  })
  @IsBoolean()
  pourvoiCourDeCassation: boolean

  @ApiProperty({
    description: "Pourvoi local d'une décision",
    type: Boolean,
    example: mockUtils.createDecisionTJDto.pourvoiLocal
  })
  @IsBoolean()
  pourvoiLocal: boolean

  @ApiPropertyOptional({
    description: 'Information sur le président de la formation du jugement',
    type: () => PresidentDto,
    example: new MockUtils().presidentDtoMock
  })
  @IsDefined()
  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PresidentDto)
  president?: PresidentDto

  @ApiProperty({
    description: "Utilisation des recommandations pour l'occultation",
    enum: Occultation,
    example: mockUtils.createDecisionTJDto.recommandationOccultation
  })
  @IsEnum(Occultation)
  recommandationOccultation: Occultation

  @ApiPropertyOptional({
    description: 'Résumé de la décision intègre',
    type: String,
    example: 'Exemple de sommaire'
  })
  @IsString()
  @IsOptional()
  sommaire?: string

  @ApiProperty({
    description: "Selection d'une décision",
    type: Boolean,
    example: mockUtils.createDecisionTJDto.selection
  })
  @IsBoolean()
  selection: boolean

  @ApiProperty({
    description: 'Libellé du code de nature particulière',
    type: String,
    example: mockUtils.createDecisionTJDto.libelleNature
  })
  @IsString()
  libelleNature: string
}
