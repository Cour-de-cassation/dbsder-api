import * as request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../app.module'
import { DecisionDTO } from '../../domain/decision.dto'
import { MockUtils } from '../utils/mock.utils'

describe('DecisionsController', () => {
  let app: INestApplication
  const mockUtils = new MockUtils()

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()

    await app.init()
  })
  describe('getDecisionIds', () => {
    it('GET /decisions/id returns a 200 with a list of decisions', async () => {
      // GIVEN
      const expectedDecisions = mockUtils.allDecisionsToBeTreated

      // WHEN
      const result = await request(app.getHttpServer()).get('/decisions/id')

      // THEN
      expect(result.statusCode).toEqual(HttpStatus.OK)
      expect(result.body).toEqual(expectedDecisions)
    })
  })
  it('GET /decision/id returns an error 404', async () => {
    // GIVEN

    // WHEN
    const result = await request(app.getHttpServer()).get('/decision/id')

    // THEN
    expect(result.statusCode).toEqual(HttpStatus.NOT_FOUND)
  })
})
