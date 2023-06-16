import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule, Test } from '@nestjs/testing'
import mongoose from 'mongoose'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import { MongoRepository } from '../db/repositories/mongo.repository'
import * as request from 'supertest'

describe('GetDecisionByIdController', () => {
  let app: INestApplication
  const mockUtils = new MockUtils()
  let mongoRepository: MongoRepository

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    mongoRepository = app.get<MongoRepository>(MongoRepository)

    const decisionToSave = { ...mockUtils.decisionModel, iddecision: 'testId' }
    mongoRepository.create(decisionToSave)

    await app.init()
  })

  afterAll(async () => {
    if (mongoose) await mongoose.disconnect()
  })
  describe('Success case', () => {
    it('returns a decision when given a valid id', async () => {
      // GIVEN
      const labelApiKey = process.env.LABEL_API_KEY
      const id = 'testId'

      // WHEN
      const result = await request(app.getHttpServer())
        .get(`/decisions/${id}`)
        .set({ 'x-api-key': labelApiKey })

      // THEN
      expect(result.status).toEqual(HttpStatus.OK)
    })
  })

  describe('Error cases', () => {
    it('throws a 404 error if the id does not exist', async () => {
      // GIVEN
      const labelApiKey = process.env.LABEL_API_KEY
      const id = 'fakeId'

      // WHEN
      const result = await request(app.getHttpServer())
        .get(`/decisions/${id}`)
        .set({ 'x-api-key': labelApiKey })

      // THEN
      expect(result.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('throws a 401 error if the apiKey is not valid', async () => {
      // GIVEN
      const id = 'testId'

      // WHEN
      const result = await request(app.getHttpServer())
        .get(`/decisions/${id}`)
        .set({ 'x-api-key': 'notValidApiKey' })

      // THEN
      expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('throws a 401 error if the apiKey is not present', async () => {
      // GIVEN
      const id = 'testId'

      // WHEN
      const result = await request(app.getHttpServer()).get(`/decisions/${id}`)

      // THEN
      expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
    })
  })
})
