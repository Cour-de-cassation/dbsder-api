import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { MockUtils } from '../utils/mock.utils'
import { Sources } from 'dbsder-api-types'

const mockUtils = new MockUtils()

export class GetDecisionRouteDTO {
  @ApiProperty({
    description: 'Source de la décision (TJ/CA/CC...)',
    enum: Sources,
    example: mockUtils.decisionModel.sourceName
  })
  @IsEnum(Sources)
  source: Sources

  @ApiProperty({
    description: 'Code NAC de la décision',
    example: mockUtils.decisionModel.NACCode
  })
  @IsString()
  codeNac: string

  @ApiProperty({
    description: 'Code décision (endCaseCode) de la décision',
    example: mockUtils.decisionModel.endCaseCode
  })
  @IsString()
  codeDecision: string
}
