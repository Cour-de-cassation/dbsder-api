import { mock, MockProxy } from 'jest-mock-extended'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { UpdateDecisionPseudonymiseeUsecase } from './updateDecisionPseudonymisee.usecase'
import { MockUtils } from '../infrastructure/utils/mock.utils'

describe('UpdateDecisionPseudonymiseeUsecase', () => {
  const mockDecisionsRepository: MockProxy<InterfaceDecisionsRepository> =
    mock<InterfaceDecisionsRepository>()
  const usecase: UpdateDecisionPseudonymiseeUsecase = new UpdateDecisionPseudonymiseeUsecase(
    mockDecisionsRepository
  )
  const mockUtils = new MockUtils()
  const decisionId = 'some-id'
  const pseudoText = 'some-PseudonymisedDecision'
  const labelTreatment = [mockUtils.labelTreatment]

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns decision ID when decision is successfully updated', async () => {
    // GIVEN
    const decisionId = 'some-id'
    jest.spyOn(mockDecisionsRepository, 'getById').mockResolvedValue(mockUtils.decisionModel)
    jest
      .spyOn(mockDecisionsRepository, 'updateDecisionPseudonymisee')
      .mockImplementationOnce(() => Promise.resolve(decisionId))

    // WHEN
    const result = await usecase.execute(decisionId, pseudoText, labelTreatment)

    // THEN
    expect(result).toEqual(decisionId)
  })

  it('propagates an Error when repository returns an error', async () => {
    // GIVEN
    jest
      .spyOn(mockDecisionsRepository, 'updateDecisionPseudonymisee')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    // WHEN
    await expect(usecase.execute(decisionId, pseudoText, labelTreatment))
      // THEN
      .rejects.toThrowError(Error)
  })
})
