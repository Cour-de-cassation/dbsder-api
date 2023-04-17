import * as request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../app.module'
import { MockUtils } from '../utils/mock.utils'
import { DecisionStatus } from '../../domain/enum'

describe('DecisionsController', () => {
  let app: INestApplication
  const mockUtils = new MockUtils()
  const readApiKey = 'e4f747f0-35f0-4127-b415-9a39f7537cc8'

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()

    await app.init()
  })

  describe('GET /decisions', () => {
    it('returns a 200 with a list of decisions', async () => {
      // GIVEN
      const expectedDecisions = mockUtils.allDecisionsToBeTreated

      // WHEN
      const result = await request(app.getHttpServer())
        .get('/decisions')
        .query({ status: DecisionStatus.TOBETREATED })
        .set({ 'x-api-key': readApiKey })

      // THEN
      expect(result.statusCode).toEqual(HttpStatus.OK)
      expect(result.body).toEqual(expectedDecisions)
    })

    it('returns an error 400 if status is missing', async () => {
      // WHEN
      const result = await request(app.getHttpServer())
        .get('/decisions')
        .set({ 'x-api-key': readApiKey })

      // THEN
      expect(result.statusCode).toEqual(HttpStatus.BAD_REQUEST)
    })

    it('returns an error 400 if status does not exist', async () => {
      // GIVEN
      const statusNotAccepted = 'tata'

      // WHEN
      const result = await request(app.getHttpServer())
        .get('/decisions')
        .query({ status: statusNotAccepted })
        .set({ 'x-api-key': readApiKey })

      // THEN
      expect(result.statusCode).toEqual(HttpStatus.BAD_REQUEST)
    })

    it('returns an error 404 when url is wrong', async () => {
      // WHEN
      const result = await request(app.getHttpServer())
        .get('/decision')
        .set({ 'x-api-key': readApiKey })

      // THEN
      expect(result.statusCode).toEqual(HttpStatus.NOT_FOUND)
    })

    it('returns an error 401 when apiKey is not provided', async () => {
      // WHEN
      const result = await request(app.getHttpServer()).get('/decisions')

      // THEN
      expect(result.statusCode).toEqual(HttpStatus.UNAUTHORIZED)
    })
  })
})
