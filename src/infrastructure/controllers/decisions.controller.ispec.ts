import * as request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../app.module'

describe('DecisionsController', () => {
  let app: INestApplication

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

      // WHEN
      const result = await request(app.getHttpServer()).get('/decisions/id')

      // THEN
      expect(result.statusCode).toEqual(HttpStatus.OK)
    })
  })
})
