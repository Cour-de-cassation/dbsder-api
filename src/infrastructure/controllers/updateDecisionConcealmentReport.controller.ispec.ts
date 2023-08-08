import * as request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import { MongoRepository } from '../db/repositories/mongo.repository'
import { connectDatabase, dropCollections, dropDatabase } from '../utils/db-test.utils'

describe('DecisionsController', () => {
  let app: INestApplication
  let mongoRepository: MongoRepository

  const mockUtils = new MockUtils()
  const validApiKey = process.env.LABEL_API_KEY
  const decisionId = 'some-valid-id'
  const rapportOccultations = [
    {
      annotations: [
        {
          category: 'some-category',
          entityId: 'some-entity-id',
          start: 1,
          text: 'some-text',
          certaintyScore: 80
        }
      ],
      source: 'some-source',
      order: 1
    }
  ]

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    mongoRepository = app.get<MongoRepository>(MongoRepository)
    await connectDatabase()
  })

  afterEach(async () => {
    await dropCollections()
  })

  afterAll(async () => {
    await dropDatabase()
  })

  describe('PUT /decisions/:id/rapport-occultations', () => {
    describe('Success case', () => {
      it('returns 204 No Content when decision is updated with valid API Key and concealment report', async () => {
        // GIVEN
        const decisionToSave = {
          ...mockUtils.decisionModel,
          _id: decisionId
        }
        await mongoRepository.create(decisionToSave)

        // WHEN
        const result = await request(app.getHttpServer())
          .put(`/decisions/${decisionId}/rapport-occultations`)
          .set({ 'x-api-key': validApiKey })
          .send({ rapportOccultations })

        // THEN
        expect(result.status).toEqual(HttpStatus.NO_CONTENT)
      })

      it('returns 204 No Content when decision is updated with a concealment report already in database', async () => {
        // GIVEN
        const decisionToSave = {
          ...mockUtils.decisionModel,
          _id: decisionId,
          rapportOccultations
        }
        await mongoRepository.create(decisionToSave)

        // WHEN
        const result = await request(app.getHttpServer())
          .put(`/decisions/${decisionId}/rapport-occultations`)
          .set({ 'x-api-key': validApiKey })
          .send({ rapportOccultations })

        // THEN
        expect(result.status).toEqual(HttpStatus.NO_CONTENT)
      })
    })

    describe('Error cases', () => {
      describe('returns 401 Unauthorized', () => {
        it('when apiKey is not provided', async () => {
          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/rapport-occultations`)
            .send({ rapportOccultations })

          // THEN
          expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('when apiKey does not exist', async () => {
          // GIVEN
          const unknownApiKey = 'unknownApiKey'

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/rapport-occultations`)
            .set({ 'x-api-key': unknownApiKey })
            .send({ rapportOccultations })

          // THEN
          expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
        })
      })

      it('returns 403 Forbidden when the apiKey is not authorized to call this endpoint', async () => {
        // GIVEN
        const unauthorizedApiKey = process.env.NORMALIZATION_API_KEY

        // WHEN
        const result = await request(app.getHttpServer())
          .put(`/decisions/${decisionId}/rapport-occultations`)
          .set({ 'x-api-key': unauthorizedApiKey })
          .send({ rapportOccultations })

        // THEN
        expect(result.status).toEqual(HttpStatus.FORBIDDEN)
      })

      describe('returns 400 Bad Request', () => {
        it('when concealment report is not provided', async () => {
          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/rapport-occultations`)
            .set({ 'x-api-key': validApiKey })

          // THEN
          expect(result.status).toEqual(HttpStatus.BAD_REQUEST)
        })

        it('when provided concealment report has a wrong format', async () => {
          // GIVEN
          const wrongConcealmentReportFormat = 'some report'

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/rapport-occultations`)
            .set({ 'x-api-key': validApiKey })
            .send({ rapportOccultations: wrongConcealmentReportFormat })

          // THEN
          expect(result.status).toEqual(HttpStatus.BAD_REQUEST)
        })
      })

      it('returns 404 Not Found when provided ID does not exist', async () => {
        // GIVEN
        const unknownDecisionId = 'unknownDecisionId'

        // WHEN
        const result = await request(app.getHttpServer())
          .put(`/decisions/${unknownDecisionId}/rapport-occultations`)
          .set({ 'x-api-key': validApiKey })
          .send({ rapportOccultations })

        // THEN
        expect(result.status).toEqual(HttpStatus.NOT_FOUND)
      })
    })
  })
})
