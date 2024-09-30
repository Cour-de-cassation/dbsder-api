import * as request from 'supertest'
import { TestingModule, Test } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { connectDatabase, dropCollections, dropDatabase } from '../utils/db-test.utils'

describe('GetDecisionByIdController', () => {
  let app: INestApplication
  const mockUtils = new MockUtils()
  let decisionsRepository: DecisionsRepository

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

  describe('Success case', () => {
    it('returns a 200 OK with found decision when given a valid ID', async () => {
      // GIVEN
      const decisionToSave = {
        ...mockUtils.decisionModel,
        dateImport: new Date().toISOString(),
        datePublication: null
      }
      const decisionId = await decisionsRepository.create(decisionToSave)
      const labelApiKey = process.env.LABEL_API_KEY

      // WHEN
      const result = await request(app.getHttpServer())
        .get(`/decisions/${decisionId}`)
        .set({ 'x-api-key': labelApiKey })

      // THEN
      expect(result.status).toEqual(HttpStatus.OK)
    })
  })

  describe('Error cases', () => {
    it('throws a 404 Not Found error if the ID does not exist', async () => {
      // GIVEN
      const labelApiKey = process.env.LABEL_API_KEY
      const unknownDecisionId = '007f1f77bcf86cd799439011'

      // WHEN
      const result = await request(app.getHttpServer())
        .get(`/decisions/${unknownDecisionId}`)
        .set({ 'x-api-key': labelApiKey })

      // THEN
      expect(result.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('throws a 401 Unauthorized error when the apiKey is not authorized to call this endpoint', async () => {
      // GIVEN
      const normalisationApiKey = process.env.NORMALIZATION_API_KEY
      const decisionToSave = {
        ...mockUtils.decisionModel,
        dateImport: new Date().toISOString(),
        datePublication: null
      }
      const decisionId = await decisionsRepository.create(decisionToSave)

      // WHEN
      const result = await request(app.getHttpServer())
        .get(`/decisions/${decisionId}`)
        .set({ 'x-api-key': normalisationApiKey })

      // THEN
      expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('throws a 401 Unauthorized error when the apiKey is not valid', async () => {
      // GIVEN
      const decisionToSave = {
        ...mockUtils.decisionModel,
        dateImport: new Date().toISOString(),
        datePublication: null
      }
      const decisionId = await decisionsRepository.create(decisionToSave)

      // WHEN
      const result = await request(app.getHttpServer())
        .get(`/decisions/${decisionId}`)
        .set({ 'x-api-key': 'notValidApiKey' })

      // THEN
      expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('throws a 401 Unauthorized error when the apiKey is not present', async () => {
      // GIVEN
      const decisionToSave = {
        ...mockUtils.decisionModel,
        dateImport: new Date().toISOString(),
        datePublication: null
      }
      const decisionId = await decisionsRepository.create(decisionToSave)

      // WHEN
      const result = await request(app.getHttpServer()).get(`/decisions/${decisionId}`)

      // THEN
      expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
    })
  })
})
