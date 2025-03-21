import * as request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import { DecisionsRepository } from '../db/repositories/decisions.repository'
import { connectDatabase, dropCollections, dropDatabase } from '../utils/db-test.utils'
import { DateType } from '../utils/dateType.utils'

describe('DecisionsController', () => {
  let app: INestApplication
  const mockUtils = new MockUtils()
  const labelApiKey = process.env.LABEL_API_KEY
  const providedDecisionModel = mockUtils.decisionModel

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
    const indexApiKey = process.env.INDEX_API_KEY

    describe('Success case', () => {
      it('returns a 200 OK with a list of decisions from known source', async () => {
        // GIVEN
        const decisionId = await decisionsRepository.create(providedDecisionModel)
        const expectedDecisions = [mockUtils.decisionTJToBeTreated]
        const getDecisionsListDTO = mockUtils.decisionQueryDTO
        expectedDecisions[0]._id = decisionId
        // WHEN
        const result = await request(app.getHttpServer())
          .get('/decisions')
          .query(getDecisionsListDTO)
          .set({ 'x-api-key': labelApiKey })

        // THEN
        expect(result.statusCode).toEqual(HttpStatus.OK)
        expect(result.body).toEqual(expectedDecisions)
      })

      it('returns a 200 OK with a list of decisions with given number', async () => {
        // GIVEN
        const decisionId = await decisionsRepository.create(providedDecisionModel)
        const expectedDecisions = [mockUtils.decisionTJToBeTreated]
        const getDecisionsListDTO = mockUtils.decisionQueryByNumberDTO
        expectedDecisions[0]._id = decisionId

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

      it('when the apiKey is not authorized to call this endpoint', async () => {
        // GIVEN
        const mockGetDecisionListQuery = mockUtils.decisionQueryDTO
        const normalisationApiKey = process.env.OPS_API_KEY

        // WHEN
        const result = await request(app.getHttpServer())
          .get('/decisions')
          .query(mockGetDecisionListQuery)
          .set({ 'x-api-key': normalisationApiKey })

        // THEN
        expect(result.statusCode).toEqual(HttpStatus.UNAUTHORIZED)
      })
    })

    describe('returns 400 Bad Request error', () => {
      it('when status does not exist', async () => {
        // GIVEN
        const statusNotAccepted = 'tata'

        // WHEN
        const result = await request(app.getHttpServer())
          .get('/decisions')
          .query({ status: statusNotAccepted })
          .set({ 'x-api-key': labelApiKey })

        // THEN
        expect(result.statusCode).toEqual(HttpStatus.BAD_REQUEST)
      })

      it('when a source is unknown', async () => {
        // GIVEN
        const getDecisionsListWithUnknownSourceDTO = mockUtils.decisionQueryWithUnknownSourceDTO

        // WHEN
        const result = await request(app.getHttpServer())
          .get('/decisions')
          .query(getDecisionsListWithUnknownSourceDTO)
          .set({ 'x-api-key': labelApiKey })

        // THEN
        expect(result.statusCode).toEqual(HttpStatus.BAD_REQUEST)
      })

      it('when dateType is given and startDate & endDate do not exist', async () => {
        // WHEN
        const result = await request(app.getHttpServer())
          .get('/decisions')
          .query({ dateType: DateType.DATECREATION })
          .set({ 'x-api-key': labelApiKey })

        // THEN
        expect(result.statusCode).toEqual(HttpStatus.BAD_REQUEST)
      })
    })
  })
})
