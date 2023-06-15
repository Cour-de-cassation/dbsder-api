import { MockUtils } from '../infrastructure/utils/mock.utils'
import { ListDecisionsUsecase } from './listDecisions.usecase'
import { ServiceUnavailableException } from '@nestjs/common'
import { mock, MockProxy } from 'jest-mock-extended'
import { IDatabaseRepository } from '../domain/database.repository.interface'
import { DecisionStatus, Sources } from '../domain/enum'

describe('listDecisionUsecase', () => {
  const mockDatabaseRepository: MockProxy<IDatabaseRepository> = mock<IDatabaseRepository>()
  const listCriteria = {
    status: DecisionStatus.TOBETREATED,
    source: Sources.TJ,
    startDate: '2023-10-10',
    endDate: '2023-10-11'
  }
  let mockUtils: MockUtils
  let usecase: ListDecisionsUsecase

  beforeAll(async () => {
    mockUtils = new MockUtils()
  })

  afterAll(async () => {
    jest.clearAllMocks()
  })

  it('I can retrieve a list of decisions from the API', async () => {
    // GIVEN
    usecase = new ListDecisionsUsecase(mockDatabaseRepository)
    const expectedListDecisions = [mockUtils.decisionListResponse]
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
