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
  const pseudoText = 'some pseudonymised decision'
  const labelTreatments = [mockUtils.labelTreatment]

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

  describe('PUT /decisions/:id/decision-pseudonymisee', () => {
    describe('Success case', () => {
      it('returns 204 No Content when decision pseudonymised-decision is updated with valid API Key and pseudonymised-decision', async () => {
        // GIVEN
        const decisionToSave = mockUtils.decisionModel
        const decisionId = await decisionsRepository.create(decisionToSave)

        // WHEN
        const result = await request(app.getHttpServer())
          .put(`/decisions/${decisionId}/decision-pseudonymisee`)
          .set({ 'x-api-key': validApiKey })
          .send({ pseudoText, labelTreatments })

        // THEN
        expect(result.status).toEqual(HttpStatus.NO_CONTENT)
      })

      it('returns 204 No Content when decision pseudonymised-decision is updated with a pseudonymised-decision already in database', async () => {
        // GIVEN
        const decisionToSave = {
          ...mockUtils.decisionModel,
          pseudoText,
          labelTreatments
        }
        const decisionId = await decisionsRepository.create(decisionToSave)

        // WHEN
        const result = await request(app.getHttpServer())
          .put(`/decisions/${decisionId}/decision-pseudonymisee`)
          .set({ 'x-api-key': validApiKey })
          .send({ pseudoText, labelTreatments })

        // THEN
        expect(result.status).toEqual(HttpStatus.NO_CONTENT)
      })
    })

    describe('Error cases', () => {
      describe('returns 401 Unauthorized', () => {
        it('when apiKey is not provided', async () => {
          // GIVEN
          const decisionToSave = {
            ...mockUtils.decisionModel,
            pseudoText,
            labelTreatments
          }
          const decisionId = await decisionsRepository.create(decisionToSave)

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/decision-pseudonymisee`)
            .send({ pseudoText, labelTreatments })

          // THEN
          expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('when apiKey does not exist', async () => {
          // GIVEN
          const decisionToSave = {
            ...mockUtils.decisionModel,
            pseudoText,
            labelTreatments
          }
          const decisionId = await decisionsRepository.create(decisionToSave)

          const unknownApiKey = 'unknownApiKey'

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/decision-pseudonymisee`)
            .set({ 'x-api-key': unknownApiKey })
            .send({ pseudoText, labelTreatments })

          // THEN
          expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('when the apiKey is not authorized to call this endpoint', async () => {
          // GIVEN
          const decisionToSave = {
            ...mockUtils.decisionModel,
            pseudoText,
            labelTreatments
          }

          const decisionId = await decisionsRepository.create(decisionToSave)
          const unauthorizedApiKey = process.env.NORMALIZATION_API_KEY

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/decision-pseudonymisee`)
            .set({ 'x-api-key': unauthorizedApiKey })
            .send({ pseudoText, labelTreatments })

          // THEN
          expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
        })
      })

      describe('returns 400 Bad Request', () => {
        it('when pseudoText is not provided', async () => {
          // GIVEN
          const decisionToSave = {
            ...mockUtils.decisionModel,
            pseudoText,
            labelTreatments
          }
          const decisionId = await decisionsRepository.create(decisionToSave)

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/decision-pseudonymisee`)
            .set({ 'x-api-key': validApiKey })
            .send({ labelTreatments })

          // THEN
          expect(result.status).toEqual(HttpStatus.BAD_REQUEST)
        })

        it('when pseudoText is not a string', async () => {
          // GIVEN
          const decisionToSave = {
            ...mockUtils.decisionModel,
            pseudoText
          }
          const decisionId = await decisionsRepository.create(decisionToSave)

          const wrongFormatpseudoText = 123

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/decision-pseudonymisee`)
            .set({ 'x-api-key': validApiKey })
            .send({ pseudoText: wrongFormatpseudoText })

          // THEN
          expect(result.status).toEqual(HttpStatus.BAD_REQUEST)
        })

        it('when labelTreatments is not provided', async () => {
          // GIVEN
          const decisionToSave = {
            ...mockUtils.decisionModel,
            pseudoText,
            labelTreatments
          }
          const decisionId = await decisionsRepository.create(decisionToSave)

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/decision-pseudonymisee`)
            .set({ 'x-api-key': validApiKey })
            .send({ pseudoText })

          // THEN
          expect(result.status).toEqual(HttpStatus.BAD_REQUEST)
        })
      })

      it('returns 404 Not Found when provided ID does not exist', async () => {
        // GIVEN
        const unknownDecisionId = '007f1f77bcf86cd799439011'

        // WHEN
        const result = await request(app.getHttpServer())
          .put(`/decisions/${unknownDecisionId}/decision-pseudonymisee`)
          .set({ 'x-api-key': validApiKey })
          .send({ pseudoText, labelTreatments })

        // THEN
        expect(result.status).toEqual(HttpStatus.NOT_FOUND)
      })
    })
  })
})
