import { MockUtils } from '../infrastructure/utils/mock.utils'
import { ListDecisionsUsecase } from './listDecisions.usecase'
import { ServiceUnavailableException } from '@nestjs/common'
import { mock, MockProxy } from 'jest-mock-extended'
import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'

describe('listDecisionUsecase', () => {
  const mockDatabaseRepository: MockProxy<IDatabaseRepository> = mock<IDatabaseRepository>()
  const mockUtils = new MockUtils()
  const listCriteria = mockUtils.decisionQueryDTO
  let usecase: ListDecisionsUsecase

  afterAll(async () => {
    jest.clearAllMocks()
  })

  it('Retrieves a list of decisions from the repository', async () => {
    // GIVEN
    usecase = new ListDecisionsUsecase(mockDatabaseRepository)
    const expectedListDecisions = [mockUtils.decisionTJToBeTreated]
    jest.spyOn(mockDatabaseRepository, 'list').mockResolvedValue([mockUtils.decisionModel])

    // WHEN
    const result = await usecase.execute(listCriteria)

    // THEN
    expect(result).toEqual(expectedListDecisions)
  })

  it('I receive an error if the DB malfunctions', async () => {
    // GIVEN
    usecase = new ListDecisionsUsecase(mockDatabaseRepository)
    jest.spyOn(mockDatabaseRepository, 'list').mockImplementationOnce(() => {
      throw new ServiceUnavailableException('Error from repository')
    })

    await expect(usecase.execute(listCriteria)).rejects.toThrow(
      new ServiceUnavailableException('Error from repository')
    )
  })
})
