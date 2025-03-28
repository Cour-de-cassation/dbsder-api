import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { MockUtils } from '../utils/mock.utils'

const mockUtils = new MockUtils()

export class GetDecisionRouteDTO {
  @ApiProperty({
    description: 'Code NAC de la décision',
    example: mockUtils.decisionModel.NACCode
  })
  @IsString()
  codeNac: string
}
