import { MockUtils } from '../../infrastructure/utils/mock.utils'
import { CreateDecisionUsecase } from './createDecision.usecase'
import { MongoRepository } from '../../infrastructure/db/repositories/mongo.repository'
import { ServiceUnavailableException } from '@nestjs/common'
import { mock, MockProxy } from 'jest-mock-extended'

describe('createDecisionUsecase', () => {
  const mockMongoRepository = new MongoRepository(process.env.MONGO_DB_URL)
  let mockUtils: MockUtils
  let usecase: CreateDecisionUsecase

  beforeAll(async () => {
    mockUtils = new MockUtils()
  })

  afterAll(async () => {
    //jest.clearAllMocks()
  })

  it("J'arrive à envoyer ma décision à l'API", async () => {
    // GIVEN
    usecase = new CreateDecisionUsecase(mockMongoRepository)
    const expectedDecision = mockUtils.createDecisionDTO
    jest.spyOn(mockMongoRepository, 'create').mockImplementationOnce(async () => expectedDecision)

    jest.spyOn(usecase, 'getMongoRepository').mockImplementationOnce(() => mockMongoRepository)
    // WHEN
    const result = await usecase.execute(expectedDecision)

    // THEN
    expect(result).toEqual(expectedDecision)
  })

  it("Je reçois une erreur lors d'un dysfonctionnement de la DB", async () => {
    // GIVEN
    usecase = new CreateDecisionUsecase(mockMongoRepository)
    const rejectedDecision = mockUtils.createDecisionDTO
    jest.spyOn(mockMongoRepository, 'create').mockImplementationOnce(() => {
      throw new ServiceUnavailableException('Error from repository')
    })

    await expect(usecase.execute(rejectedDecision)).rejects.toThrow(
      new ServiceUnavailableException('Error from repository')
    )
  })
})
