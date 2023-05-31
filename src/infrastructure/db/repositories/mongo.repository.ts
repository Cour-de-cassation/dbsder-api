import mongoose, { Mongoose } from 'mongoose'
import { CreateDecisionDTO } from '../../../domain/createDecisionDTO'
import { IDatabaseRepository } from './database.repository.interface'
import { DecisionModel, DecisionSchema } from '../models/decision.model'
import { ServiceUnavailableException } from '@nestjs/common'

export class MongoRepository implements IDatabaseRepository {
  private mongoClient: Mongoose
  constructor(private readonly mongoURL: string, mongoClient?: Mongoose) {
    if (mongoClient) {
      this.mongoClient = mongoClient
    }
  }

  async create(decision: CreateDecisionDTO): Promise<DecisionModel> {
    await this.setMongoClient()
    if (this.mongoClient.model) {
      const collection = this.mongoClient.model('decisions', DecisionSchema)
      const decisionToBeSaved = await collection.create(decision).catch(() => {
        throw new ServiceUnavailableException('Error from database')
      })
      return Promise.resolve(decisionToBeSaved)
    }
    return null
  }

  async setMongoClient() {
    if (!this.mongoClient) {
      this.mongoClient = await mongoose.connect(this.mongoURL)
    }
  }
}
