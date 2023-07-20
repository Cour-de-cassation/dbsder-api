import { mock, MockProxy } from 'jest-mock-extended'
import { MockUtils } from '../infrastructure/utils/mock.utils'
import { ListDecisionsUsecase } from './listDecisions.usecase'
import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'

describe('listDecisionUsecase', () => {
  const mockDatabaseRepository: MockProxy<IDatabaseRepository> = mock<IDatabaseRepository>()
  const mockUtils = new MockUtils()
  const listCriteria = mockUtils.decisionQueryDTO
  const usecase: ListDecisionsUsecase = new ListDecisionsUsecase(mockDatabaseRepository)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('retrieves a list of decisions from the repository', async () => {
    // GIVEN
    const expectedListDecisions = [mockUtils.decisionTJToBeTreated]
    jest.spyOn(mockDatabaseRepository, 'list').mockResolvedValue([mockUtils.decisionModel])

    // WHEN
    const result = await usecase.execute(listCriteria)

    // THEN
    expect(result).toEqual(expectedListDecisions)
  })

  it('propagates an Error when repository returns an error', async () => {
    // GIVEN
    jest.spyOn(mockDatabaseRepository, 'list').mockImplementationOnce(() => {
      throw new Error()
    })

    // WHEN
    await expect(usecase.execute(listCriteria))
      // THEN
      .rejects.toThrow(Error)
  })
})
