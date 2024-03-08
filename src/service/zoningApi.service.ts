import axios from 'axios'
import { CreateDecisionDTO } from '../infrastructure/dto/createDecision.dto'
import { LogsFormat } from '../infrastructure/utils/logsFormat.utils'
import {
  Logger,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  ServiceUnavailableException
} from '@nestjs/common'

export class ZoningApiService {
  private readonly logger = new Logger()

  async getDecisionZoning(decision: CreateDecisionDTO) {
    // const zoningUrl = process.env.ZONING_API_URL
    const zoningRequestParameters = JSON.stringify({
      arret_id: decision.sourceId,
      source: decision.sourceName,
      text: decision.originalText
    })
    const zoningApiUrl = process.env.ZONING_API_URL

    const result = await axios({
      data: zoningRequestParameters,
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      url: `${zoningApiUrl}/zonage`
    }).catch((error) => {
      const formatLogs: LogsFormat = {
        operationName: 'getDecisionZoning',
        msg: 'Error while calling Zoning API'
      }
      if (error.response) {
        if (error.response.data.statusCode === HttpStatus.BAD_REQUEST) {
          this.logger.error({
            ...formatLogs,
            msg: error.response.data.message,
            data: error.response.data,
            statusCode: HttpStatus.BAD_REQUEST
          })
          throw new BadRequestException(
            'Zoning API Bad request error : ' + error.response.data.message
          )
        } else if (error.response.data.statusCode === HttpStatus.UNAUTHORIZED) {
          this.logger.error({
            ...formatLogs,
            msg: error.response.data.message,
            data: error.response.data,
            statusCode: HttpStatus.UNAUTHORIZED
          })
          throw new UnauthorizedException('You are not authorized to call this route')
        } else if (error.response.data.statusCode === HttpStatus.CONFLICT) {
          this.logger.error({
            ...formatLogs,
            msg: error.response.data.message,
            data: error.response.data,
            statusCode: HttpStatus.CONFLICT
          })
          throw new ConflictException('Zoning API error: ' + error.response.data.message)
        } else {
          this.logger.error({
            ...formatLogs,
            msg: error.response.data.message,
            data: error.response.data,
            statusCode: HttpStatus.SERVICE_UNAVAILABLE
          })
        }
      }
      throw new ServiceUnavailableException('Zoning API is unavailable')
    })
    return result.data
  }
}
