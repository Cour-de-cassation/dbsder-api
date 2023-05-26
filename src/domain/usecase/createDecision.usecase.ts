import { CreateDecisionDTO } from '../createDecisionDTO'
import { MongoRepository } from '../../infrastructure/db/repositories/mongo.repository'
import { Logger, ServiceUnavailableException } from '@nestjs/common'
import { IDatabaseRepository } from '../../infrastructure/db/repositories/database.repository.interface'
import { DecisionModel } from '../../infrastructure/db/models/decision.model'

export class CreateDecisionUsecase {
  private readonly logger = new Logger()
  constructor(private mongoRepository: IDatabaseRepository) {}

  async execute(decision: CreateDecisionDTO): Promise<DecisionModel> {
    this.mongoRepository = this.getMongoRepository(process.env.MONGO_DB_URL)
    const savedDecision = await this.mongoRepository.create(decision).catch((error) => {
      this.logger.error(error)
      throw new ServiceUnavailableException('Error from repository')
    })
    return savedDecision
  }

  getMongoRepository(mongodbURL: string): MongoRepository {
    return new MongoRepository(mongodbURL)
  }
}
