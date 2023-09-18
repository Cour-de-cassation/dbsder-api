import * as request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { connectDatabase, dropCollections, dropDatabase } from '../utils/db-test.utils'

describe('DecisionsController', () => {
  let app: INestApplication
  const mockUtils = new MockUtils()
  const labelApiKey = process.env.LABEL_API_KEY
  const indexApiKey = process.env.INDEX_API_KEY
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

  describe('GET /decisions', () => {
    describe('Success case', () => {
      it('returns a 200 OK with a list of decisions with given number', async () => {
        // GIVEN
        await decisionsRepository.create(mockUtils.decisionModel)
        const expectedDecisions = [mockUtils.decisionTJToBeTreated]
        const getDecisionsListDTO = mockUtils.decisionQueryByNumberDTO

        // WHEN
        const result = await request(app.getHttpServer())
          .get('/decisions')
          .query(getDecisionsListDTO)
          .set({ 'x-api-key': indexApiKey })

        // THEN
        expect(result.statusCode).toEqual(HttpStatus.OK)
        expect(result.body).toEqual(expectedDecisions)
      })
    })

    describe('returns 401 Unauthorized', () => {
      it('when apiKey is not provided', async () => {
        // WHEN
        const result = await request(app.getHttpServer()).get('/decisions')

        // THEN
        expect(result.statusCode).toEqual(HttpStatus.UNAUTHORIZED)
      })

      it('when apiKey does not exist', async () => {
        // WHEN
        const unknownApiKey = 'notTestLabelApiKey'
        const result = await request(app.getHttpServer())
          .get('/decisions')
          .set({ 'x-api-key': unknownApiKey })

        // THEN
        expect(result.statusCode).toEqual(HttpStatus.UNAUTHORIZED)
      })
    })

    describe('returns 403 Forbidden', () => {
      it('when the apiKey is not authorized to call this endpoint', async () => {
        // GIVEN
        const mockGetDecisionListQuery = mockUtils.decisionQueryByNumberDTO

        // WHEN
        const result = await request(app.getHttpServer())
          .get('/decisions')
          .query(mockGetDecisionListQuery)
          .set({ 'x-api-key': labelApiKey })

        // THEN
        expect(result.statusCode).toEqual(HttpStatus.FORBIDDEN)
      })
    })
  })
})
