import { mock, MockProxy } from 'jest-mock-extended'
import { InterfaceDecisionsRepository } from '../infrastructure/db/decisions.repository.interface'
import { UpdateDecisionPseudonymiseeUsecase } from './updateDecisionPseudonymisee.usecase'

describe('UpdateDecisionPseudonymiseeUsecase', () => {
  const mockDecisionsRepository: MockProxy<InterfaceDecisionsRepository> =
    mock<InterfaceDecisionsRepository>()
  const usecase: UpdateDecisionPseudonymiseeUsecase = new UpdateDecisionPseudonymiseeUsecase(
    mockDecisionsRepository
  )
  const decisionId = 'some-id'
  const decisionPseudonymisedDecision = 'some-PseudonymisedDecision'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns decision ID when decision is successfully updated', async () => {
    // GIVEN
    const decisionId = 'some-id'
    jest
      .spyOn(mockDecisionsRepository, 'updateDecisionPseudonymisee')
      .mockImplementationOnce(() => Promise.resolve(decisionId))

    // WHEN
    const result = await usecase.execute(decisionId, decisionPseudonymisedDecision)

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
    await expect(usecase.execute(decisionId, decisionPseudonymisedDecision))
      // THEN
      .rejects.toThrowError(Error)
  })
})
