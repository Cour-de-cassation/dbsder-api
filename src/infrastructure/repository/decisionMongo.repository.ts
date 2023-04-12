import { ServiceUnavailableException } from '@nestjs/common'
import mongoose, { Mongoose } from 'mongoose'
import { DecisionDTO, DecisionSchema } from '../../domain/decision.dto'

export class DecisionMongoRepository {
  private mongoClient: Mongoose

  async saveDecision(decision: DecisionDTO): Promise<DecisionDTO> {
    console.log('Decision test')
    this.mongoClient = await mongoose.connect(process.env.MONGODB_URL)

    const collections = this.mongoClient.model('decisions', DecisionSchema)

    return this.insertDecision(collections, decision).catch(() => {
      throw new ServiceUnavailableException('Error from database')
    })
  }

  async insertDecision(collection, decision: DecisionDTO): Promise<DecisionDTO> {
    return collection.create(decision).catch((error) => {
      throw new ServiceUnavailableException('Error from database')
    })
  }
}
