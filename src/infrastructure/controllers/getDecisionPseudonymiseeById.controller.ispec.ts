import * as request from 'supertest'
import { TestingModule, Test } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { connectDatabase, dropCollections, dropDatabase } from '../utils/db-test.utils'

describe('GetDecisionPseudonymiseeByIdController', () => {
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
    it('returns a 200 OK with found decision when given a valid ID with personal data', async () => {
      // GIVEN
      const decisionToSave = mockUtils.createDecisionDTO
      const decisionId = await decisionsRepository.create(decisionToSave)
      const opensderApiKey = process.env.OPENSDER_API_KEY

      // WHEN
      const result = await request(app.getHttpServer())
        .get(`/decisions-pseudonymisees/${decisionId}?avecMetadonneesPersonnelles=true`)
        .set({ 'x-api-key': opensderApiKey })

      // THEN
      expect(result.status).toEqual(HttpStatus.OK)
    })
    it('returns a 200 OK with found decision when given a valid ID without personal data', async () => {
      // GIVEN
      const decisionToSave = mockUtils.createDecisionDTO
      const decisionId = await decisionsRepository.create(decisionToSave)
      const indexApiKey = process.env.INDEX_API_KEY

      // WHEN
      const result = await request(app.getHttpServer())
        .get(`/decisions-pseudonymisees/${decisionId}?avecMetadonneesPersonnelles=false`)
        .set({ 'x-api-key': indexApiKey })

      // THEN
      expect(result.status).toEqual(HttpStatus.OK)
    })
  })

  describe('Error cases', () => {
    it('throws a 404 Not Found error if the ID does not exist', async () => {
      // GIVEN
      const opensderApiKey = process.env.OPENSDER_API_KEY
      const unknownDecisionId = '007f1f77bcf86cd799439011'

      // WHEN
      const result = await request(app.getHttpServer())
        .get(`/decisions-pseudonymisees/${unknownDecisionId}?avecMetadonneesPersonnelles=true`)
        .set({ 'x-api-key': opensderApiKey })

      // THEN
      expect(result.status).toEqual(HttpStatus.NOT_FOUND)
    })

    it('throws a 401 Unauthorized error if the Api Key is not allowed to use this filter', async () => {
      // GIVEN
      const decisionToSave = mockUtils.createDecisionDTO
      const decisionId = await decisionsRepository.create(decisionToSave)
      const indexApiKey = process.env.INDEX_API_KEY

      // WHEN
      const result = await request(app.getHttpServer())
        .get(`/decisions-pseudonymisees/${decisionId}?avecMetadonneesPersonnelles=true`)
        .set({ 'x-api-key': indexApiKey })

      // THEN
      expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('throws a 401 Unauthorized error when the apiKey is not valid', async () => {
      // GIVEN
      const decisionToSave = mockUtils.createDecisionDTO
      const decisionId = await decisionsRepository.create(decisionToSave)

      // WHEN
      const result = await request(app.getHttpServer())
        .get(`/decisions-pseudonymisees/${decisionId}?avecMetadonneesPersonnelles=true`)
        .set({ 'x-api-key': 'notValidApiKey' })

      // THEN
      expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('throws a 401 Unauthorized error when the apiKey is not present', async () => {
      // GIVEN
      const decisionToSave = mockUtils.createDecisionDTO
      const decisionId = await decisionsRepository.create(decisionToSave)

      // WHEN
      const result = await request(app.getHttpServer()).get(
        `/decisions-pseudonymisees/${decisionId}`
      )

      // THEN
      expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
    })
  })
})
