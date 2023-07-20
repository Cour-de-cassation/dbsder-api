import { MockProxy, mock } from 'jest-mock-extended'
import { FetchDecisionByIdUsecase } from './fetchDecisionById.usecase'
import { MockUtils } from '../infrastructure/utils/mock.utils'
import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'
import { DecisionNotFoundError } from '../domain/errors/decisionNotFound.error'
import { DatabaseError } from '../domain/errors/database.error'

describe('FetchDecisionByIdUsecase', () => {
  const mockDatabaseRepository: MockProxy<IDatabaseRepository> = mock<IDatabaseRepository>()
  const mockUtils = new MockUtils()
  const usecase = new FetchDecisionByIdUsecase(mockDatabaseRepository)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('Success case', () => {
    it('returns the decision when provided ID exist', async () => {
      //GIVEN
      const id = '1'
      const expectedDecision = mockUtils.decisionModel
      jest.spyOn(mockDatabaseRepository, 'getDecisionById').mockResolvedValue(expectedDecision)

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
      jest.spyOn(mockDatabaseRepository, 'getDecisionById').mockImplementationOnce(() => {
        throw new DatabaseError('')
      })

      // WHEN
      await expect(usecase.execute(id))
        // THEN
        .rejects.toThrow(DatabaseError)
    })

    it('throws a not found exception when the decision does not exist', async () => {
      // GIVEN
      jest.spyOn(mockDatabaseRepository, 'getDecisionById').mockResolvedValue(null)

      // WHEN
      await expect(usecase.execute(id))
        // THEN
        .rejects.toThrow(DecisionNotFoundError)
    })
  })
})
