import { MockProxy, mock } from 'jest-mock-extended'
import { MockUtils } from '../infrastructure/utils/mock.utils'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { DecisionNotFoundError } from '../domain/errors/decisionNotFound.error'
import { DatabaseError } from '../domain/errors/database.error'
import { FetchDecisionPseudonymiseeByIdUsecase } from './fetchDecisionPseudonymiseeByIdUsecase'

describe('FetchDecisionPseudomymiseeByIdUsecase', () => {
  const mockDecisionsRepository: MockProxy<InterfaceDecisionsRepository> =
    mock<InterfaceDecisionsRepository>()
  const mockUtils = new MockUtils()
  const usecase = new FetchDecisionPseudonymiseeByIdUsecase(mockDecisionsRepository)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('Success case', () => {
    it('returns the decision when provided ID exist', async () => {
      //GIVEN
      const id = '1'
      const dateImport = new Date().toISOString()
      const datePublication = null
      const expectedDecision = {
        ...mockUtils.decisionPseudonymisee,
        dateImport,
        datePublication
      }
      jest
        .spyOn(mockDecisionsRepository, 'getById')
        .mockResolvedValue({ ...mockUtils.decisionModel, dateImport, datePublication })

      // WHEN
      const decision = await usecase.execute(id, true)

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
      await expect(usecase.execute(id, true))
        // THEN
        .rejects.toThrow(DatabaseError)
    })

    it('throws a not found exception when the decision does not exist', async () => {
      // GIVEN
      jest.spyOn(mockDecisionsRepository, 'getById').mockResolvedValue(null)

      // WHEN
      await expect(usecase.execute(id, true))
        // THEN
        .rejects.toThrow(DecisionNotFoundError)
    })
  })
})
