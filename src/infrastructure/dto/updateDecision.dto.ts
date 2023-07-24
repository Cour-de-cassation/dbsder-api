import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { MockUtils } from '../utils/mock.utils'
import { DecisionStatus } from '../../domain/enum'

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
