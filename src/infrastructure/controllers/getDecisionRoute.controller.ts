import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Request,
  UsePipes,
  Query
} from '@nestjs/common'
import {
  ApiHeader,
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger'
import { ApiKeyValidation } from '../auth/apiKeyValidation'
import { ClientNotAuthorizedException } from '../exceptions/clientNotAuthorized.exception'
import { LogsFormat } from '../utils/logsFormat.utils'
import { DependencyException } from '../exceptions/dependency.exception'
import { UnexpectedException } from '../exceptions/unexpected.exception'
import { FindDecisionRouteUseCase } from '../../usecase/findDecisionRoute.usecase'
import { GetDecisionRouteDTO } from '../dto/getRoute.dto'
import { ValidateDtoPipe } from '../pipes/validateDto.pipe'
import { CodeNACsRepository } from '../db/repositories/codeNACs.repository'

@ApiTags('DbSder')
@Controller('decision-route')
export class GetDecisionRouteController {
  constructor(private readonly codeNACsRepository: CodeNACsRepository) {}

  private readonly logger = new Logger(GetDecisionRouteController.name)

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiHeader({
    name: 'x-api-key',
    description: 'Clé API'
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({
    description: 'Code NAC manquant ou invalide'
  })
  @ApiNotFoundResponse({
    description: 'Route non trouvée'
  })
  @ApiUnauthorizedResponse({
    description: "Vous n'êtes pas autorisé à appeler cette route"
  })
  @UsePipes(new ValidateDtoPipe())
  async getDecisionRoute(@Query() query: GetDecisionRouteDTO, @Request() req): Promise<any> {
    const routePath = `${req.method} ${req.path}`
    const formatLogs: LogsFormat = {
      operationName: 'getDecisionRoute',
      httpMethod: req.method,
      path: req.path,
      msg: `${routePath} called with codeNac ${query.codeNac}.`
    }
    this.logger.log(formatLogs)

    const authorizedApiKeys = [process.env.LABEL_API_KEY]
    const apiKey = req.headers['x-api-key']
    if (!ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)) {
      throw new ClientNotAuthorizedException()
    }

    const findDecisionRouteUseCase = new FindDecisionRouteUseCase(this.codeNACsRepository)

    try {
      const result = await findDecisionRouteUseCase.execute(query.codeNac)
      this.logger.log({
        ...formatLogs,
        msg: routePath + ' returns ' + HttpStatus.OK,
        data: result,
        statusCode: HttpStatus.OK
      })
      return result
    } catch (error) {
      if (error instanceof DependencyException) {
        this.logger.error({
          ...formatLogs,
          msg: error.message,
          statusCode: HttpStatus.SERVICE_UNAVAILABLE
        })
        throw new DependencyException(error.message)
      }
      this.logger.error({
        ...formatLogs,
        msg: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      })
      throw new UnexpectedException(error)
    }
  }
}
