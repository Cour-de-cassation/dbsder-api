import { ApiProperty } from '@nestjs/swagger'
import { MockUtils } from '../../utils/mock.utils'

const mockutils = new MockUtils()
export class CreateDecisionResponse {
  @ApiProperty({
    description: 'Identifiant de la décision créée',
    example: mockutils.createDecisionResponse._id
  })
  _id: string

  @ApiProperty({
    description: 'Réponse de la création de la décision',
    example: mockutils.createDecisionResponse.message
  })
  message: string
}
