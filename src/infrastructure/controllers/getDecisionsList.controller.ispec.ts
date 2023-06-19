import * as request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import mongoose from 'mongoose'
import { MongoRepository } from '../db/repositories/mongo.repository'

describe('DecisionsController', () => {
  let app: INestApplication
  const mockUtils = new MockUtils()
  const labelApiKey = process.env.LABEL_API_KEY
  let mongoRepository: MongoRepository

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()

    await app.init()
    mongoRepository = moduleFixture.get<MongoRepository>(MongoRepository)

    mongoRepository.create(mockUtils.decisionModel)
  })

  afterAll(async () => {
    if (mongoose) {
      await mongoRepository.getModel().deleteMany({})
      await mongoose.disconnect()
    }
  })

  describe('GET /decisions', () => {
    describe('Success case', () => {
      it('returns a 200 with a list of decisions from known source', async () => {
        // GIVEN
        const expectedDecisions = [mockUtils.decisionTJToBeTreated]
        const getDecisionsListDTO = mockUtils.decisionQueryDTO

        // WHEN
        const result = await request(app.getHttpServer())
          .get('/decisions')
          .query(getDecisionsListDTO)
          .set({ 'x-api-key': labelApiKey })

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

    describe('returns 400 Bad Request error', () => {
      it('when status is missing', async () => {
        // WHEN
        const result = await request(app.getHttpServer())
          .get('/decisions')
          .set({ 'x-api-key': labelApiKey })

        // THEN
        expect(result.statusCode).toEqual(HttpStatus.BAD_REQUEST)
      })

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
    })

    describe('returns 403 Forbidden', () => {
      it('when the apiKey is not authorized to call this endpoint', async () => {
        // GIVEN
        const mockGetDecisionListQuery = mockUtils.decisionQueryDTO
        const normalisationApiKey = process.env.NORMALIZATION_API_KEY

        // WHEN
        const result = await request(app.getHttpServer())
          .get('/decisions')
          .query(mockGetDecisionListQuery)
          .set({ 'x-api-key': normalisationApiKey })

        // THEN
        expect(result.statusCode).toEqual(HttpStatus.FORBIDDEN)
      })
    })

    it('returns a 400 with a list of decisions with non validated source', async () => {
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
  })
})
