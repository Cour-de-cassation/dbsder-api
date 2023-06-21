import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'
import { GetDecisionByIdResponse } from '../infrastructure/controllers/responses/getDecisionById.response'
import { MapModelToResponseService } from '../service/mapModelToResponse.service'

export class FetchDecisionByIdUsecase {
  constructor(private mongoRepository: IDatabaseRepository) {}

  async execute(id: string) : Promise<GetDecisionByIdResponse> {
    const decision = await this.mongoRepository.getDecisionById(id)

    return new MapModelToResponseService().mapGetDecisionByIdToResponse(decision)
  }
}
