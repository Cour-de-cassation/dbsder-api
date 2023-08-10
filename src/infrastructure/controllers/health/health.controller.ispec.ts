import mongoose from 'mongoose'
import * as request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { AppModule } from '../../../app.module'

describe('HealthController', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication({ logger: false })
    await app.init()
  })

  afterAll(async () => {
    if (mongoose) await mongoose.disconnect()
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

    it('returns a 503 SERVICE UNAVAILABLE with DB status DOWN when DB is unavailable', async () => {
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
