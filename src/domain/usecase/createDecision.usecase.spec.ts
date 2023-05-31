import { MockUtils } from '../../infrastructure/utils/mock.utils'
import { CreateDecisionUsecase } from './createDecision.usecase'
import { ServiceUnavailableException } from '@nestjs/common'
import { mock, MockProxy } from 'jest-mock-extended'
import { IDatabaseRepository } from 'src/infrastructure/db/repositories/database.repository.interface'

describe('createDecisionUsecase', () => {
  const mockDatabaseRepository: MockProxy<IDatabaseRepository> = mock<IDatabaseRepository>()
  let mockUtils: MockUtils
  let usecase: CreateDecisionUsecase

  beforeAll(async () => {
    mockUtils = new MockUtils()
  })

  afterAll(async () => {
    jest.clearAllMocks()
  })

  it("J'arrive à envoyer ma décision à l'API", async () => {
    // GIVEN
    usecase = new CreateDecisionUsecase(mockDatabaseRepository)
    const expectedDecision = mockUtils.createDecisionDTO
    jest
      .spyOn(mockDatabaseRepository, 'create')
      .mockImplementationOnce(async () => expectedDecision)

    // WHEN
    const result = await usecase.execute(expectedDecision)

    // THEN
    expect(result).toEqual(expectedDecision)
  })

  it("Je reçois une erreur lors d'un dysfonctionnement de la DB", async () => {
    // GIVEN
    usecase = new CreateDecisionUsecase(mockDatabaseRepository)
    const rejectedDecision = mockUtils.createDecisionDTO
    jest.spyOn(mockDatabaseRepository, 'create').mockImplementationOnce(() => {
      throw new ServiceUnavailableException('Error from repository')
    })

    await expect(usecase.execute(rejectedDecision)).rejects.toThrow(
      new ServiceUnavailableException('Error from repository')
    )
  })
})
