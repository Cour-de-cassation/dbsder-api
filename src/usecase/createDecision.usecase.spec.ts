import { MockUtils } from '../infrastructure/utils/mock.utils'
import { CreateDecisionUsecase } from './createDecision.usecase'
import { ServiceUnavailableException } from '@nestjs/common'
import { mock, MockProxy } from 'jest-mock-extended'
import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'

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

  it('I can send my decision to the API', async () => {
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

  it('I receive an error if the DB malfunctions', async () => {
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
