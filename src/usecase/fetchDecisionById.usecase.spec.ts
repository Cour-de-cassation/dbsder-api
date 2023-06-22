import { MockProxy, mock } from 'jest-mock-extended'
import { FetchDecisionByIdUsecase } from './fetchDecisionById.usecase'
import { MockUtils } from '../infrastructure/utils/mock.utils'
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'

describe('FetchDecisionByIdUsecase', () => {
  const mockDatabaseRepository: MockProxy<IDatabaseRepository> = mock<IDatabaseRepository>()
  const mockUtils = new MockUtils()
  const usecase = new FetchDecisionByIdUsecase(mockDatabaseRepository)

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
    it("returns a service unavailable when the respository don't respond", () => {
      // GIVEN
      jest
        .spyOn(mockDatabaseRepository, 'getDecisionById')
        .mockRejectedValue(new ServiceUnavailableException())

      // WHEN
      expect(() => usecase.execute(id))
        // THEN
        .rejects.toThrow(ServiceUnavailableException)
    })

    it('throws a not found exception when the decision does not exist', () => {
      // GIVEN
      jest
        .spyOn(mockDatabaseRepository, 'getDecisionById')
        .mockRejectedValue(new NotFoundException())

      // WHEN
      expect(() => usecase.execute(id))
        // THEN
        .rejects.toThrow(NotFoundException)
    })
  })
})
