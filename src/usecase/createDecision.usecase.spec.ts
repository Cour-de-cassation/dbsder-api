import { MockUtils } from '../infrastructure/utils/mock.utils'
import { CreateDecisionUsecase } from './createDecision.usecase'
import { mock, MockProxy } from 'jest-mock-extended'
import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'
import { DatabaseError } from '../domain/errors/database.error'

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

  it('creates decision successfully when database is available', async () => {
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

  it('throws a 503 Service Unavailable when database is unavailable', async () => {
    // GIVEN
    usecase = new CreateDecisionUsecase(mockDatabaseRepository)
    const rejectedDecision = mockUtils.createDecisionDTO
    jest.spyOn(mockDatabaseRepository, 'create').mockImplementationOnce(() => {
      throw new DatabaseError('')
    })

    await expect(usecase.execute(rejectedDecision)).rejects.toThrow(DatabaseError)
  })
})
