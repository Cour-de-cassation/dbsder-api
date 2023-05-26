import mongoose, { Mongoose } from 'mongoose'
import { CreateDecisionDTO } from '../../../domain/createDecisionDTO'
import { IDatabaseRepository } from './database.repository.interface'
import { DecisionModel, DecisionSchema } from '../models/decision.model'
import { ServiceUnavailableException } from '@nestjs/common'

export class MongoRepository implements IDatabaseRepository {
  private mongoClient: Mongoose
  constructor(private readonly mongoURL: string) {}

  async create(decision: CreateDecisionDTO): Promise<DecisionModel> {
    console.log('INSIDE CREATE')
    await this.setMongoClient()
    if (this.mongoClient) {
      const collection = this.mongoClient.model('decisions', DecisionSchema)
      const decisionToBeSaved = await collection.create(decision).catch(() => {
        return Promise.resolve(decisionToBeSaved)
        throw new ServiceUnavailableException('Error from database')
      })
      return Promise.resolve(decisionToBeSaved)
    }
    return null
  }

  async setMongoClient() {
    if (!this.mongoClient) {
      console.log('INSIDE setMongoClient')
      this.mongoClient = await mongoose.connect(this.mongoURL)
    }
  }
}
