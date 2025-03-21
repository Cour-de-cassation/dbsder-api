import { mock, MockProxy } from 'jest-mock-extended'
import { MockUtils } from '../infrastructure/utils/mock.utils'
import { ListDecisionsUsecase } from './listDecisions.usecase'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { mapDecisionSearchCriteriaToDTO } from '../domain/decisionSearchCriteria'
import { DateType } from '../infrastructure/utils/dateType.utils'

describe('listDecisionUsecase', () => {
  const mockDecisionsRepository: MockProxy<InterfaceDecisionsRepository> =
    mock<InterfaceDecisionsRepository>()
  const mockUtils = new MockUtils()
  const listCriteria = mockUtils.decisionQueryDTO
  const usecase: ListDecisionsUsecase = new ListDecisionsUsecase(mockDecisionsRepository)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('retrieves a list of decisions from the repository', async () => {
    // GIVEN
    const expectedListDecisions = [mockUtils.decisionTJToBeTreated]
    jest.spyOn(mockDecisionsRepository, 'list').mockResolvedValue([mockUtils.decisionModel])

    // WHEN
    const result = await usecase.execute(listCriteria)

    // THEN
    expect(result).toEqual(expectedListDecisions)
  })

  it('propagates an Error when repository returns an error', async () => {
    // GIVEN
    jest.spyOn(mockDecisionsRepository, 'list').mockImplementationOnce(() => {
      throw new Error()
    })

    // WHEN
    await expect(usecase.execute(listCriteria))
      // THEN
      .rejects.toThrow(Error)
  })

  it('When mapDecisionSearchCriteriaToDTO return given dateType', () => {
    expect(
      mapDecisionSearchCriteriaToDTO({ ...listCriteria, dateType: DateType.DATECREATION }).dateType
    ).toEqual(DateType.DATECREATION)
  })

  it('When mapDecisionSearchCriteriaToDTO return default dateType', () => {
    expect(mapDecisionSearchCriteriaToDTO(listCriteria).dateType).toEqual(DateType.DATEDECISION)
  })
})
