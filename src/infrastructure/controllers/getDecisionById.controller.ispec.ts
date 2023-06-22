import mongoose from 'mongoose'
import * as request from 'supertest'
import { TestingModule, Test } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import { MongoRepository } from '../db/repositories/mongo.repository'

describe('GetDecisionByIdController', () => {
  let app: INestApplication
  const mockUtils = new MockUtils()
  let mongoRepository: MongoRepository
  const decisionId = 'validId'

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    mongoRepository = app.get<MongoRepository>(MongoRepository)

    await app.init()
  })

  // beforeEach(async () => {
  //   if (mongoose) {
  //     await mongoose.connect(process.env.MONGO_DB_URL)
  //     await mongoose.connection.db.dropDatabase()
  //   }
  // })

  afterAll(async () => {
    if (mongoose) await mongoose.disconnect()
  })

  describe('Success case', () => {
    it('returns a decision when given a valid ID', async () => {
      // GIVEN
      const decisionToSave = { ...mockUtils.decisionModel, iddecision: decisionId }
      await mongoRepository.create(decisionToSave)
      const labelApiKey = process.env.LABEL_API_KEY

      // WHEN
      const result = await request(app.getHttpServer())
        .get(`/decisions/${decisionId}`)
        .set({ 'x-api-key': labelApiKey })

      // THEN
      expect(result.status).toEqual(HttpStatus.OK)
      await mongoose.connect(process.env.MONGO_DB_URL)
      await mongoose.connection.db.dropDatabase()
    })
  })

  describe('Error cases', () => {
    it('throws a 404 error if the ID does not exist', async () => {
      // GIVEN
      const labelApiKey = process.env.LABEL_API_KEY
      const unknownDecisionId = 'unknownDecisionId'

      // WHEN
      const result = await request(app.getHttpServer())
        .get(`/decisions/${unknownDecisionId}`)
        .set({ 'x-api-key': labelApiKey })

      // THEN
      expect(result.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('throws a 401 error if the apiKey is not valid', async () => {
      // WHEN
      const result = await request(app.getHttpServer())
        .get(`/decisions/${decisionId}`)
        .set({ 'x-api-key': 'notValidApiKey' })

      // THEN
      expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('throws a 401 error if the apiKey is not present', async () => {
      // WHEN
      const result = await request(app.getHttpServer()).get(`/decisions/${decisionId}`)

      // THEN
      expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
    })
  })
})
