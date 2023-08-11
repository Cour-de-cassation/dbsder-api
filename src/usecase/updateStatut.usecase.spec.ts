import { mock, MockProxy } from 'jest-mock-extended'
import { UpdateStatutUsecase } from './updateStatut.usecase'
import { InterfaceDecisionsRepository } from '../infrastructure/db/decisions.repository.interface'

describe('UpdateStatutUsecase', () => {
  const mockDecisionsRepository: MockProxy<InterfaceDecisionsRepository> =
    mock<InterfaceDecisionsRepository>()
  const usecase: UpdateStatutUsecase = new UpdateStatutUsecase(mockDecisionsRepository)
  const decisionId = 'some-id'
  const decisionStatus = 'some-status'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns decision ID when decision is successfully updated', async () => {
    // GIVEN
    const decisionId = 'some-id'
    jest
      .spyOn(mockDecisionsRepository, 'updateStatut')
      .mockImplementationOnce(() => Promise.resolve(decisionId))

    // WHEN
    const result = await usecase.execute(decisionId, decisionStatus)

    // THEN
    expect(result).toEqual(decisionId)
  })

  it('propagates an Error when repository returns an error', async () => {
    // GIVEN
    jest.spyOn(mockDecisionsRepository, 'updateStatut').mockImplementationOnce(() => {
      throw new Error()
    })

    // WHEN
    await expect(usecase.execute(decisionId, decisionStatus))
      // THEN
      .rejects.toThrowError(Error)
  })
})
