import { Controller, Delete, Logger, Param, Request } from '@nestjs/common'
import {
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { ApiKeyValidation } from '../auth/apiKeyValidation'
import { GetDecisionByIdResponse } from './responses/getDecisionById.response'
import { ClientNotAuthorizedException } from '../exceptions/clientNotAuthorized.exception'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { LogsFormat } from '../utils/logsFormat.utils'

@ApiTags('DbSder')
@Controller('decisions')
export class DeleteDecisionByIdController {
  constructor(private readonly decisionsRepository: DecisionsRepository) {}

  private readonly logger = new Logger()

  @Delete(':id')
  @ApiHeader({
    name: 'x-api-key',
    description: 'Clé API'
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant de la décision'
  })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({
    description: "La decision n'a pas été trouvée"
  })
  @ApiUnauthorizedResponse({
    description: "Vous n'êtes pas autorisé à appeler cette route"
  })
  async deleteDecisionById(
    @Param('id') id: string,
    @Request() req
  ): Promise<GetDecisionByIdResponse> {
    const authorizedApiKeys = [process.env.OPS_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ClientNotAuthorizedException()
    }
    //const fetchDecisionByIdUsecase = new FetchDecisionByIdUsecase(this.decisionsRepository)

    const formatLogs: LogsFormat = {
      operationName: 'deleteDecisionById',
      httpMethod: req.method,
      path: req.path,
      msg: `DELETE /decisions/:id called with id ${id}`
    }
    this.logger.log(formatLogs)

    return
  }
}
