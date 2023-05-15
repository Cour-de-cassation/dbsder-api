import mongoose, { Mongoose } from 'mongoose'
import { CreateDecisionDTO } from '../../../domain/createDecisionDTO'
import { IDatabaseRepository } from './database.repository.interface'
import { DecisionSchema } from '../models/decision.model'
import { ServiceUnavailableException } from '@nestjs/common';

export class MongoRepository implements IDatabaseRepository {
  private mongoClient : Mongoose;
  constructor(private readonly mongoURL: string) {}

  async create(decision: CreateDecisionDTO): Promise<string> { 
    await this.setMongoClient()    
    if (this.mongoClient) {
      const collection = this.mongoClient.model('decisions', DecisionSchema)
      await collection.create(decision).catch((error) => {        
        throw new ServiceUnavailableException('Error from database : ' + error, )
      })
    }
    return Promise.resolve('decision saved in db.')
  }

  async setMongoClient() {
    if (!this.mongoClient) {
      this.mongoClient = await mongoose.connect(this.mongoURL)
    }
  }

  disconnect() {
    if (this.mongoClient) {
      this.mongoClient.disconnect()
    }
  }
}
