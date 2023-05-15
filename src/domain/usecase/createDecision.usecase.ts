import { CreateDecisionDTO } from '../createDecisionDTO'
import { MongoRepository } from '../../infrastructure/db/repositories/mongo.repository'

export class CreateDecisionUsecase {
  private mongoRepository: MongoRepository
  
   async execute(decision: CreateDecisionDTO): Promise<string> {
    this.mongoRepository = this.getMongoRepository(process.env.MONGO_DB_URL)
    await this.mongoRepository.create(decision)
    return 'executed'
  }

  getMongoRepository(mongodbURL : string) : MongoRepository
  {
    return new MongoRepository(mongodbURL)
  }
}
