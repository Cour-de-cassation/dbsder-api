import * as request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import { DecisionStatus } from '../../domain/enum'
import mongoose from 'mongoose'

describe('DecisionsController', () => {
  let app: INestApplication
  const mockUtils = new MockUtils()
  const labelApiKey = process.env.LABEL_API_KEY

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()

    await app.init()
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('GET /decisions', () => {
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
        const normalisationApiKey = process.env.NORMALIZATION_API_KEY

        // WHEN
        const result = await request(app.getHttpServer())
          .get('/decisions')
          .query({ status: DecisionStatus.TOBETREATED })
          .set({ 'x-api-key': normalisationApiKey })

        // THEN
        expect(result.statusCode).toEqual(HttpStatus.FORBIDDEN)
      })
    })

    it('returns a 200 with a list of decisions', async () => {
      // GIVEN
      const expectedDecisions = mockUtils.allDecisionsToBeTreated

      // WHEN
      const result = await request(app.getHttpServer())
        .get('/decisions')
        .query({ status: DecisionStatus.TOBETREATED })
        .set({ 'x-api-key': labelApiKey })

      // THEN
      expect(result.statusCode).toEqual(HttpStatus.OK)
      expect(result.body).toEqual(expectedDecisions)
    })
  })
})