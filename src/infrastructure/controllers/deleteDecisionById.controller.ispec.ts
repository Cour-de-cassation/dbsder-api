import * as request from 'supertest'
import { TestingModule, Test } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { connectDatabase, dropCollections, dropDatabase } from '../utils/db-test.utils'

describe('DeleteDecisionByIdController', () => {
  let app: INestApplication
  const mockUtils = new MockUtils()
  let decisionsRepository: DecisionsRepository
  const decisionId = '507f1f77bcf86cd799439011'

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
    it('returns a 204 No content and delete the decision with the given valid id', async () => {
      // GIVEN
      const decisionToSave = { ...mockUtils.decisionModel, _id: decisionId }
      await decisionsRepository.create(decisionToSave)
      const opsApiKey = process.env.OPS_API_KEY
      const labelApiKey = process.env.LABEL_API_KEY

      // WHEN
      const result = await request(app.getHttpServer())
        .delete(`/decisions/${decisionId}`)
        .set({ 'x-api-key': opsApiKey })

      const resultAfterDelete = await request(app.getHttpServer())
        .get(`/decisions/${decisionId}`)
        .set({ 'x-api-key': labelApiKey })

      // THEN
      expect(result.status).toEqual(HttpStatus.NO_CONTENT)
      expect(resultAfterDelete.status).toEqual(HttpStatus.NOT_FOUND)
    })
  })

  describe('Error cases', () => {
    it('throws a 404 Not Found error if the ID does not exist', async () => {
      // GIVEN
      const opsApiKey = process.env.OPS_API_KEY
      const unknownDecisionId = '007f1f77bcf86cd799439011'

      // WHEN
      const result = await request(app.getHttpServer())
        .delete(`/decisions/${unknownDecisionId}`)
        .set({ 'x-api-key': opsApiKey })

      // THEN
      expect(result.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('throws a 401 Unauthorized error when the apiKey is not authorized to call this endpoint', async () => {
      // GIVEN
      const normalisationApiKey = process.env.NORMALIZATION_API_KEY

      // WHEN
      const result = await request(app.getHttpServer())
        .delete(`/decisions/${decisionId}`)
        .set({ 'x-api-key': normalisationApiKey })

      // THEN
      expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('throws a 401 Unauthorized error when the apiKey is not valid', async () => {
      // WHEN
      const result = await request(app.getHttpServer())
        .delete(`/decisions/${decisionId}`)
        .set({ 'x-api-key': 'notValidApiKey' })

      // THEN
      expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('throws a 401 Unauthorized error when the apiKey is not present', async () => {
      // WHEN
      const result = await request(app.getHttpServer()).delete(`/decisions/${decisionId}`)

      // THEN
      expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('throws a 503 Service unavailable when database connection drops', async () => {
      // GIVEN
      await dropDatabase()
      const opsApiKey = process.env.OPS_API_KEY

      // WHEN
      const result = await request(app.getHttpServer())
        .delete(`/decisions/${decisionId}`)
        .set({ 'x-api-key': opsApiKey })

      await connectDatabase()

      // THEN
      expect(result.status).toEqual(HttpStatus.SERVICE_UNAVAILABLE)
    })
  })
})
