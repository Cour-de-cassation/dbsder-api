import * as request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { connectDatabase, dropCollections, dropDatabase } from '../utils/db-test.utils'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { LabelStatus } from 'dbsder-api-types'

describe('DecisionsController', () => {
  let app: INestApplication
  let decisionsRepository: DecisionsRepository

  const mockUtils = new MockUtils()
  const validApiKey = process.env.LABEL_API_KEY

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

  describe('PUT /decisions/:id/statut', () => {
    const validStatus = LabelStatus.TOBETREATED

    describe('Success case', () => {
      it('returns 204 No Content when decision status is updated with valid API Key and status', async () => {
        // GIVEN
        const decisionToSave = {
          ...mockUtils.decisionModel,
          labelStatus: LabelStatus.TOBETREATED,
          dateImport: new Date().toISOString(),
          datePublication: null,
          dateDepublication: null
        }

        const decisionId = await decisionsRepository.create(decisionToSave)

        // WHEN
        const result = await request(app.getHttpServer())
          .put(`/decisions/${decisionId}/statut`)
          .set({ 'x-api-key': validApiKey })
          .send({ statut: LabelStatus.LOADED })

        // THEN
        expect(result.status).toEqual(HttpStatus.NO_CONTENT)
      })

      it('returns 204 No Content when decision status is updated with a status already in database', async () => {
        // GIVEN
        const decisionToSave = {
          ...mockUtils.decisionModel,
          labelStatus: LabelStatus.TOBETREATED,
          dateImport: new Date().toISOString(),
          datePublication: null,
          dateDepublication: null
        }
        const decisionId = await decisionsRepository.create(decisionToSave)

        // WHEN
        const result = await request(app.getHttpServer())
          .put(`/decisions/${decisionId}/statut`)
          .set({ 'x-api-key': validApiKey })
          .send({ statut: LabelStatus.TOBETREATED })

        // THEN
        expect(result.status).toEqual(HttpStatus.NO_CONTENT)
      })
    })

    describe('Error cases', () => {
      describe('returns 401 Unauthorized', () => {
        it('when apiKey is not provided', async () => {
          const decisionToSave = {
            ...mockUtils.decisionModel,
            labelStatus: LabelStatus.TOBETREATED,
            dateImport: new Date().toISOString(),
            datePublication: null,
            dateDepublication: null
          }
          const decisionId = await decisionsRepository.create(decisionToSave)

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/statut`)
            .send({ statut: validStatus })

          // THEN
          expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('when apiKey does not exist', async () => {
          // GIVEN
          const decisionToSave = {
            ...mockUtils.decisionModel,
            labelStatus: LabelStatus.TOBETREATED,
            dateImport: new Date().toISOString(),
            datePublication: null,
            dateDepublication: null
          }
          const decisionId = await decisionsRepository.create(decisionToSave)

          const unknownApiKey = 'unknownApiKey'

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/statut`)
            .set({ 'x-api-key': unknownApiKey })
            .send({ statut: validStatus })

          // THEN
          expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
        })

        it('when the apiKey is not authorized to call this endpoint', async () => {
          // GIVEN
          const decisionToSave = {
            ...mockUtils.decisionModel,
            labelStatus: LabelStatus.TOBETREATED,
            dateImport: new Date().toISOString(),
            datePublication: null,
            dateDepublication: null
          }
          const decisionId = await decisionsRepository.create(decisionToSave)

          const unauthorizedApiKey = process.env.NORMALIZATION_API_KEY

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/statut`)
            .set({ 'x-api-key': unauthorizedApiKey })
            .send({ statut: validStatus })

          // THEN
          expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
        })
      })

      describe('returns 400 Bad Request', () => {
        it('when status is not provided', async () => {
          const decisionToSave = {
            ...mockUtils.decisionModel,
            labelStatus: LabelStatus.TOBETREATED,
            dateImport: new Date().toISOString(),
            datePublication: null,
            dateDepublication: null
          }
          const decisionId = await decisionsRepository.create(decisionToSave)

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/statut`)
            .set({ 'x-api-key': validApiKey })

          // THEN
          expect(result.status).toEqual(HttpStatus.BAD_REQUEST)
        })

        it('when provided status is unknown', async () => {
          // GIVEN
          const decisionToSave = {
            ...mockUtils.decisionModel,
            labelStatus: LabelStatus.TOBETREATED,
            dateImport: new Date().toISOString(),
            datePublication: null,
            dateDepublication: null
          }
          const decisionId = await decisionsRepository.create(decisionToSave)

          const unknownStatus = 'unknownStatus'

          // WHEN
          const result = await request(app.getHttpServer())
            .put(`/decisions/${decisionId}/statut`)
            .set({ 'x-api-key': validApiKey })
            .send({ statut: unknownStatus })

          // THEN
          expect(result.status).toEqual(HttpStatus.BAD_REQUEST)
        })
      })

      it('returns 404 Not Found when provided ID does not exist', async () => {
        // GIVEN
        const unknownDecisionId = '007f1f77bcf86cd799439011'

        // WHEN
        const result = await request(app.getHttpServer())
          .put(`/decisions/${unknownDecisionId}/statut`)
          .set({ 'x-api-key': validApiKey })
          .send({ statut: validStatus })

        // THEN
        expect(result.status).toEqual(HttpStatus.NOT_FOUND)
      })
    })
  })
})
