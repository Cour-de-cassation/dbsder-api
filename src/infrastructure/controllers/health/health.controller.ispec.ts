import mongoose from 'mongoose'
import * as request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongooseModule } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { AppModule } from '../../../app.module'

describe('HealthController', () => {
  let app: INestApplication
  let mongoMemoryServer: MongoMemoryServer

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: { port: parseInt(process.env.MONGO_DB_PORT), ip: process.env.MONGO_DB_IP }
    })

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MongooseModule.forRoot(mongoMemoryServer.getUri())]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    if (mongoose) await mongoose.disconnect()
    if (mongoMemoryServer) await mongoMemoryServer.stop()
  })

  describe('GET /health', () => {
    it('returns a 403 FORBIDDEN when provided API Key is not valid', async () => {
      // GIVEN
      const invalidApiKey = process.env.LABEL_API_KEY

      // WHEN
      const result = await request(app.getHttpServer())
        .get('/health')
        .set({ 'x-api-key': invalidApiKey })

      // THEN
      expect(result.statusCode).toEqual(HttpStatus.FORBIDDEN)
    })

    it('returns a 200 OK with DB status UP when DB is available', async () => {
      // GIVEN
      const validApiKey = process.env.OPS_API_KEY
      const expectedStatus = 'ok'
      const expectedMongoStatus = 'up'

      // WHEN
      const result = await request(app.getHttpServer())
        .get('/health')
        .set({ 'x-api-key': validApiKey })

      // THEN
      expect(result.statusCode).toEqual(HttpStatus.OK)
      expect(result.body.status).toEqual(expectedStatus)
      expect(result.body.info.mongoose.status).toEqual(expectedMongoStatus)
    })

    it('returns a 503 OK with DB status DOWN when DB is unavailable', async () => {
      // GIVEN
      const validApiKey = process.env.OPS_API_KEY
      await mongoose.disconnect()
      const expectedStatus = 'error'
      const expectedMongoStatus = 'down'

      // WHEN
      const result = await request(app.getHttpServer())
        .get('/health')
        .set({ 'x-api-key': validApiKey })

      // THEN
      expect(result.statusCode).toEqual(HttpStatus.SERVICE_UNAVAILABLE)
      expect(result.body.status).toEqual(expectedStatus)
      expect(result.body.error.mongoose.status).toEqual(expectedMongoStatus)
    })
  })
})
