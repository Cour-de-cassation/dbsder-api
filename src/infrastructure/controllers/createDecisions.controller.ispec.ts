import * as request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import { connectDatabase, dropCollections, dropDatabase } from '../utils/db-test.utils'

describe('DecisionsController', () => {
  let app: INestApplication
  const mockUtils = new MockUtils()

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    await connectDatabase()
  })

  afterEach(async () => {
    await dropCollections()
  })

  afterAll(async () => {
    await dropDatabase()
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

    describe('failing cases', () => {
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
        const result = await request(app.getHttpServer())
          .post('/decisions')
          .set({ 'x-api-key': '' })

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
})
