import { mock, MockProxy } from 'jest-mock-extended'
import { MockUtils } from '../infrastructure/utils/mock.utils'
import { CreateDecisionUsecase } from './createDecision.usecase'
import { InterfaceDecisionsRepository } from '../infrastructure/db/decisions.repository.interface'

describe('createDecisionUsecase', () => {
  const mockDecisionsRepository: MockProxy<InterfaceDecisionsRepository> =
    mock<InterfaceDecisionsRepository>()
  let mockUtils: MockUtils
  const usecase: CreateDecisionUsecase = new CreateDecisionUsecase(mockDecisionsRepository)

  beforeAll(async () => {
    mockUtils = new MockUtils()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('creates decision successfully when database is available', async () => {
    // GIVEN
    const expectedDecision = mockUtils.createDecisionDTO
    jest
      .spyOn(mockDecisionsRepository, 'create')
      .mockImplementationOnce(async () => expectedDecision)

    // WHEN
    const result = await usecase.execute(expectedDecision)

    // THEN
    expect(result).toEqual(expectedDecision)
  })

  it('propagates an Error when repository returns an error', async () => {
    // GIVEN
    const rejectedDecision = mockUtils.createDecisionDTO
    jest.spyOn(mockDecisionsRepository, 'create').mockImplementationOnce(() => {
      throw new Error()
    })

    await expect(usecase.execute(rejectedDecision)).rejects.toThrow(Error)
  })
})
