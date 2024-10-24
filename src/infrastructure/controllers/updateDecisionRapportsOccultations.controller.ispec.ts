import * as request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { connectDatabase, dropCollections, dropDatabase } from '../utils/db-test.utils'

describe('DecisionsController', () => {
  let app: INestApplication
  let decisionsRepository: DecisionsRepository

  const mockUtils = new MockUtils()
  const validApiKey = process.env.LABEL_API_KEY
  const rapportsOccultations = [
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

    app = moduleFixture.createNestApplication({ logger: false })
    await app.init()

    decisionsRepository = app.get<DecisionsRepository>(DecisionsRepository)
    await connectDatabase()
  })

  afterEach(async () => {
    await dropCollections()
  })

  afterAll(async () => {
    await dropDatabase()
  })

  describe('PUT /decisions/:id/rapports-occultations', () => {
    describe('Success case', () => {
      it('returns 204 No Content when decision is updated with valid API Key and concealment reports', async () => {
        // GIVEN
        const decisionToSave = mockUtils.createDecisionDTO
        const decisionId = await decisionsRepository.create(decisionToSave)

        // WHEN
        const result = await request(app.getHttpServer())
          .put(`/decisions/${decisionId}/rapports-occultations`)
          .set({ 'x-api-key': validApiKey })
          .send({ rapportsOccultations })

        // THEN
        expect(result.status).toEqual(HttpStatus.NO_CONTENT)
      })

      it('returns 204 No Content when decision is updated with concealment reports already in database', async () => {
        // GIVEN
        const decisionToSave = {
          ...mockUtils.createDecisionDTO,
          rapportsOccultations
        }
        const decisionId = await decisionsRepository.create(decisionToSave)

        // WHEN
        const result = await request(app.getHttpServer())
          .put(`/decisions/${decisionId}/rapports-occultations`)
          .set({ 'x-api-key': validApiKey })
          .send({ rapportsOccultations })

        // THEN
        expect(result.status).toEqual(HttpStatus.NO_CONTENT)
      })
    })

    describe('Error cases', () => {
      describe('returns 401 Unauthorized', () => {
        it('when apiKey is not provided', async () => {
          // GIVEN

          const decisionToSave = {
            ...mockUtils.createDecisionDTO,
            rapportsOccultations
          }
          const decisionId = await decisionsRepository.create(decisionToSave)

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/rapports-occultations`)
            .send({ rapportsOccultations })

          // THEN
          expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('when apiKey does not exist', async () => {
          // GIVEN
          const unknownApiKey = 'unknownApiKey'
          const decisionToSave = {
            ...mockUtils.createDecisionDTO,
            rapportsOccultations
          }
          const decisionId = await decisionsRepository.create(decisionToSave)

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/rapports-occultations`)
            .set({ 'x-api-key': unknownApiKey })
            .send({ rapportsOccultations })

          // THEN
          expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('when the apiKey is not authorized to call this endpoint', async () => {
          // GIVEN
          const unauthorizedApiKey = process.env.NORMALIZATION_API_KEY
          const decisionToSave = {
            ...mockUtils.createDecisionDTO,
            rapportsOccultations
          }
          const decisionId = await decisionsRepository.create(decisionToSave)

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/rapports-occultations`)
            .set({ 'x-api-key': unauthorizedApiKey })
            .send({ rapportsOccultations })

          // THEN
          expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
        })
      })

      describe('returns 400 Bad Request', () => {
        it('when concealment reports are not provided', async () => {
          // GIVEN
          const decisionToSave = {
            ...mockUtils.createDecisionDTO,
            rapportsOccultations
          }
          const decisionId = await decisionsRepository.create(decisionToSave)

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/rapports-occultations`)
            .set({ 'x-api-key': validApiKey })

          // THEN
          expect(result.status).toEqual(HttpStatus.BAD_REQUEST)
        })

        it('when provided concealment reports has a wrong format', async () => {
          // GIVEN
          const wrongConcealmentReportsFormat = 'some report'
          const decisionToSave = {
            ...mockUtils.createDecisionDTO,
            rapportsOccultations
          }
          const decisionId = await decisionsRepository.create(decisionToSave)

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/rapports-occultations`)
            .set({ 'x-api-key': validApiKey })
            .send({ rapportsOccultations: wrongConcealmentReportsFormat })

          // THEN
          expect(result.status).toEqual(HttpStatus.BAD_REQUEST)
        })
      })

      it('returns 404 Not Found when provided ID does not exist', async () => {
        // GIVEN
        const unknownDecisionId = '007f1f77bcf86cd799439011'

        // WHEN
        const result = await request(app.getHttpServer())
          .put(`/decisions/${unknownDecisionId}/rapports-occultations`)
          .set({ 'x-api-key': validApiKey })
          .send({ rapportsOccultations })

        // THEN
        expect(result.status).toEqual(HttpStatus.NOT_FOUND)
      })
    })
  })
})
