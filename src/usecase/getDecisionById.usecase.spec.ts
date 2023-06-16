import { MockProxy, mock } from 'jest-mock-extended'
import { IDatabaseRepository } from '../database.repository.interface'
import { GetDecisionByIdUsecase } from './getDecisionById.usecase'
import { MockUtils } from '../../infrastructure/utils/mock.utils'
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common'

describe('GetDecisionByIdUsecase', () => {
  const mockDatabaseRepository: MockProxy<IDatabaseRepository> = mock<IDatabaseRepository>()
  const mockUtils = new MockUtils()
  const usecase = new GetDecisionByIdUsecase(mockDatabaseRepository)

  describe('Success case', () => {
    it('A valid Id was provided and a decision was returned', async () => {
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
    it("returns a service unavailable if the respository don't respond", () => {
      // GIVEN
      const id = 'id'
      jest
        .spyOn(mockDatabaseRepository, 'getDecisionById')
        .mockRejectedValue(new ServiceUnavailableException())

      // WHEN
      expect(() => usecase.execute(id))
        .rejects // THEN
        .toThrow(ServiceUnavailableException)
    })

    it('returns a not found unavailable if the decision does not exist', () => {
      // GIVEN
      const id = 'id'
      jest.spyOn(mockDatabaseRepository, 'getDecisionById').mockResolvedValueOnce(undefined)

      // WHEN
      expect(() => usecase.execute(id))
        .rejects // THEN
        .toThrow(NotFoundException)
    })
  })
})
