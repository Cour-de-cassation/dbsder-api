import { mock, MockProxy } from 'jest-mock-extended'
import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'
import { UpdateDecisionPseudonymisedDecisionUsecase } from './updateDecisionPseudonymisedDecision.usecase'

describe('updateDecisionPseudonymisedDecisionUsecase', () => {
  const mockDatabaseRepository: MockProxy<IDatabaseRepository> = mock<IDatabaseRepository>()
  const usecase: UpdateDecisionPseudonymisedDecisionUsecase =
    new UpdateDecisionPseudonymisedDecisionUsecase(mockDatabaseRepository)
  const decisionId = 'some-id'
  const decisionPseudonymisedDecision = 'some-PseudonymisedDecision'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns decision ID when decision is successfully updated', async () => {
    // GIVEN
    const decisionId = 'some-id'
    jest
      .spyOn(mockDatabaseRepository, 'updateDecisionPseudonymisedDecision')
      .mockImplementationOnce(() => Promise.resolve(decisionId))

    // WHEN
    const result = await usecase.execute(decisionId, decisionPseudonymisedDecision)

    // THEN
    expect(result).toEqual(decisionId)
  })

  it('propagates an Error when repository returns an error', async () => {
    // GIVEN
    jest
      .spyOn(mockDatabaseRepository, 'updateDecisionPseudonymisedDecision')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    // WHEN
    await expect(usecase.execute(decisionId, decisionPseudonymisedDecision))
      // THEN
      .rejects.toThrowError(Error)
  })
})
