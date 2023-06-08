import * as request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongooseModule } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import { DecisionSchema } from '../db/models/decision.model'

describe('DecisionsController', () => {
  let app: INestApplication
  const mockUtils = new MockUtils()
  let mongoMemoryServer: MongoMemoryServer

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: {
        port: parseInt(process.env.MONGO_DB_PORT)
      }
    })
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forFeature([{ name: 'DecisionModel', schema: DecisionSchema }]),
        MongooseModule.forRoot(mongoMemoryServer.getUri())
      ]
    }).compile()

    app = moduleFixture.createNestApplication()

    await app.init()
  })

  afterAll(async () => {
    if (mongoose) await mongoose.disconnect()
    if (mongoMemoryServer) await mongoMemoryServer.stop()
  })

  describe('POST /decisions', () => {
    it('returns a 201 CREATED when provided body is valid', async () => {
      // GIVEN
      const normalizationApiKey = process.env.NORMALIZATION_API_KEY

      // WHEN
      const result = await request(app.getHttpServer())
        .post('/decisions')
        .set({ 'x-api-key': normalizationApiKey })
        .send({ decision: mockUtils.createDecisionDTO })

      // THEN
      expect(result.status).toEqual(HttpStatus.CREATED)
    })

    it('returns a 400 when called without a body', async () => {
      // GIVEN
      const normalizationApiKey = process.env.NORMALIZATION_API_KEY

      // WHEN
      const result = await request(app.getHttpServer())
        .post('/decisions')
        .set({ 'x-api-key': normalizationApiKey })

      // THEN
      expect(result.status).toEqual(HttpStatus.BAD_REQUEST)
    })

    it('returns a 400 when called with an incorrect body', async () => {
      // GIVEN
      const normalizationApiKey = process.env.NORMALIZATION_API_KEY

      // WHEN
      const result = await request(app.getHttpServer())
        .post('/decisions')
        .set({ 'x-api-key': normalizationApiKey })
        .send({ decision: { wrongKey: 'wrongValue' } })

      // THEN
      expect(result.status).toEqual(HttpStatus.BAD_REQUEST)
    })

    it('returns a 401 when apiKey is missing', async () => {
      // WHEN
      const result = await request(app.getHttpServer()).post('/decisions').set({ 'x-api-key': '' })

      // THEN
      expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('returns a 403 when a consumer not authorized (label) calls POST /decisions', async () => {
      // GIVEN
      const labelApiKey = process.env.LABEL_API_KEY

      // WHEN
      const result = await request(app.getHttpServer())
        .post('/decisions')
        .set({ 'x-api-key': labelApiKey })
        .send({ decision: mockUtils.createDecisionDTO })

      // THEN
      expect(result.status).toEqual(HttpStatus.FORBIDDEN)
    })
  })
})
