import { Zoning } from 'dbsder-api-types'
import { ZoningApiService } from './zoningApi.service'

export class FakeZoningApiService extends ZoningApiService {
  zoning: Zoning = {
    arret_id: 0
  }

  async getDecisionZoning(): Promise<Zoning> {
    return this.zoning
  }
}
