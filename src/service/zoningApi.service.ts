import axios from 'axios'
import { CreateDecisionDTO } from '../infrastructure/dto/createDecision.dto'
import { LogsFormat } from '../infrastructure/utils/logsFormat.utils'
import {
  Logger,
  HttpStatus,
  BadRequestException,
  ServiceUnavailableException,
  UnprocessableEntityException
} from '@nestjs/common'
import { Sources, Zoning } from 'dbsder-api-types'

export class ZoningApiService {
  private readonly logger = new Logger()

  async getDecisionZoning(decision: CreateDecisionDTO): Promise<Zoning> {
    if (process.env.ZONING_DISABLED === 'true') {
      this.logger.warn({
        operationName: 'getDecisionZoning',
        msg: 'Call to zoning API is disabled by env variable. Skiping.'
      })
    } else {
      let zonageSource: string
      switch (decision.sourceName) {
        case Sources.CC:
          zonageSource = 'cc'
          break
        case Sources.CA:
        case Sources.TJ:
        default:
          zonageSource = 'ca'
      }

      const zoningRequestParameters = JSON.stringify({
        arret_id: decision.sourceId,
        source: zonageSource,
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
          if (error.response.status === HttpStatus.BAD_REQUEST) {
            this.logger.error({
              ...formatLogs,
              msg: error.response.statusText,
              data: error.response.data,
              statusCode: HttpStatus.BAD_REQUEST
            })
            throw new BadRequestException(
              `Zoning API Bad request error :  + ${error.response.statusText}`
            )
          } else if (error.response.status === HttpStatus.UNPROCESSABLE_ENTITY) {
            this.logger.error({
              ...formatLogs,
              msg: error.response.statusText,
              data: error.response.data,
              statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            })
            throw new UnprocessableEntityException(
              `Le texte de la décision ${decision.sourceName}:${decision.sourceId} est mal encodé pour l'API de zonage : ${error.response.statusText}`
            )
          } else {
            console.log(error)
            this.logger.error({
              ...formatLogs,
              msg: error.response.statusText,
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
}
