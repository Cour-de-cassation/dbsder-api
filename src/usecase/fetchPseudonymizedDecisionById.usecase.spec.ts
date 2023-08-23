import { MockProxy, mock } from 'jest-mock-extended'
import { MockUtils } from '../infrastructure/utils/mock.utils'
import { InterfaceDecisionsRepository } from '../infrastructure/db/decisions.repository.interface'
import { DecisionNotFoundError } from '../domain/errors/decisionNotFound.error'
import { DatabaseError } from '../domain/errors/database.error'
import { FetchPseudonymizedDecisionByIdUsecase } from './fetchPseudonymizedDecisionById.usecase'

describe('FetchDecisionByIdUsecase', () => {
  const mockDecisionsRepository: MockProxy<InterfaceDecisionsRepository> =
    mock<InterfaceDecisionsRepository>()
  const mockUtils = new MockUtils()
  const usecase = new FetchPseudonymizedDecisionByIdUsecase(mockDecisionsRepository)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('Success case', () => {
    it('returns the decision when provided ID exist', async () => {
      //GIVEN
      const id = '1'
      //TODO change expectedDecision to a pseudonymizedModel
      const expectedDecision = mockUtils.pseudonymizedDecision
      jest.spyOn(mockDecisionsRepository, 'getById').mockResolvedValue(mockUtils.decisionModel)

      // WHEN
      const decision = await usecase.execute(id)

      // THEN
      expect(decision).toEqual(expectedDecision)
    })
  })

  describe('Fail cases', () => {
    const id = 'id'
    it("returns a service unavailable when the respository don't respond", async () => {
      // GIVEN
      jest.spyOn(mockDecisionsRepository, 'getById').mockImplementationOnce(() => {
        throw new DatabaseError('')
      })

      // WHEN
      await expect(usecase.execute(id))
        // THEN
        .rejects.toThrow(DatabaseError)
    })

    it('throws a not found exception when the decision does not exist', async () => {
      // GIVEN
      jest.spyOn(mockDecisionsRepository, 'getById').mockResolvedValue(null)

      // WHEN
      await expect(usecase.execute(id))
        // THEN
        .rejects.toThrow(DecisionNotFoundError)
    })
  })
})
