import * as request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import { connectDatabase, dropCollections, dropDatabase } from '../utils/db-test.utils'
import { DecisionsRepository } from '../db/repositories/decisions.repository'

describe('DecisionsController', () => {
  let app: INestApplication
  const mockUtils = new MockUtils()
  const normalizationApiKey = process.env.NORMALIZATION_API_KEY

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
      // WHEN
      const result = await request(app.getHttpServer())
        .post('/decisions')
        .set({ 'x-api-key': normalizationApiKey })
        .send({ decision: mockUtils.createDecisionDTO })

      // THEN
      expect(result.status).toEqual(HttpStatus.CREATED)
    })

    describe('failing cases', () => {
      it('returns a 400 Bad Request when called without a body', async () => {
        // WHEN
        const result = await request(app.getHttpServer())
          .post('/decisions')
          .set({ 'x-api-key': normalizationApiKey })

        // THEN
        expect(result.status).toEqual(HttpStatus.BAD_REQUEST)
      })

      it('returns a 400 Bad Request when called with an incorrect body', async () => {
        // WHEN
        const result = await request(app.getHttpServer())
          .post('/decisions')
          .set({ 'x-api-key': normalizationApiKey })
          .send({ decision: { wrongKey: 'wrongValue' } })

        // THEN
        expect(result.status).toEqual(HttpStatus.BAD_REQUEST)
      })

      it('returns a 401 Unauthorized when apiKey is missing', async () => {
        // WHEN
        const result = await request(app.getHttpServer())
          .post('/decisions')
          .set({ 'x-api-key': '' })

        // THEN
        expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
      })

      it('returns a 403 Forbidden when a consumer not authorized (label) calls POST /decisions', async () => {
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

      it('returns a 409 Conflict when the decision id is already used', async () => {
        // GIVEN
        const decisionsRepository = app.get<DecisionsRepository>(DecisionsRepository)
        await decisionsRepository.create(mockUtils.createDecisionDTO)

        // WHEN
        const result = await request(app.getHttpServer())
          .post('/decisions')
          .set({ 'x-api-key': normalizationApiKey })
          .send({ decision: mockUtils.createDecisionDTO })

        // THEN
        expect(result.status).toEqual(HttpStatus.CONFLICT)
      })
    })
  })
})
