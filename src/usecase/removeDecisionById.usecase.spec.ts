import { MockProxy, mock } from 'jest-mock-extended'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { DecisionNotFoundError } from '../domain/errors/decisionNotFound.error'
import { DatabaseError } from '../domain/errors/database.error'
import { RemoveDecisionByIdUsecase } from './removeDecisionById.usecase'

describe('RemoveDecisionByIdUsecase', () => {
  const mockDecisionsRepository: MockProxy<InterfaceDecisionsRepository> =
    mock<InterfaceDecisionsRepository>()
  const usecase = new RemoveDecisionByIdUsecase(mockDecisionsRepository)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('Success case', () => {
    it('removes the decision with matching id', async () => {
      //GIVEN
      const id = '1'
      jest.spyOn(mockDecisionsRepository, 'removeById').mockResolvedValue(null)

      // WHEN
      await usecase.execute(id)

      // THEN
      expect(mockDecisionsRepository.removeById).toHaveBeenCalledWith('1')
    })
  })

  describe('Fail cases', () => {
    const id = 'id'
    it("returns a service unavailable when the repository don't respond", async () => {
      // GIVEN
      jest.spyOn(mockDecisionsRepository, 'removeById').mockImplementationOnce(() => {
        throw new DatabaseError('')
      })

      // WHEN
      await expect(usecase.execute(id))
        // THEN
        .rejects.toThrow(DatabaseError)
    })

    it('throws a not found exception when the decision does not exist', async () => {
      // GIVEN
      jest
        .spyOn(mockDecisionsRepository, 'removeById')
        .mockRejectedValueOnce(new DecisionNotFoundError())

      // WHEN
      await expect(usecase.execute(id))
        // THEN
        .rejects.toThrow(DecisionNotFoundError)
    })
  })
})
