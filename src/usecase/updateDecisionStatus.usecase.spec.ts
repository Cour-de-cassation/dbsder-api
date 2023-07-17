import { mock, MockProxy } from 'jest-mock-extended'
import { UpdateDecisionStatusUsecase } from './updateDecisionStatus.usecase'
import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'

describe('updateDecisioStatusUsecase', () => {
  const mockDatabaseRepository: MockProxy<IDatabaseRepository> = mock<IDatabaseRepository>()
  const usecase: UpdateDecisionStatusUsecase = new UpdateDecisionStatusUsecase(
    mockDatabaseRepository
  )
  const decisionId = 'some-id'
  const decisionStatus = 'some-status'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns decision ID when decision is successfully updated', async () => {
    // GIVEN
    const decisionId = 'some-id'
    jest
      .spyOn(mockDatabaseRepository, 'updateDecisionStatus')
      .mockImplementationOnce(() => Promise.resolve(decisionId))

    // WHEN
    const result = await usecase.execute(decisionId, decisionStatus)

    // THEN
    expect(result).toEqual(decisionId)
  })

  it('propagates an Error when repository returns an error', async () => {
    // GIVEN
    jest.spyOn(mockDatabaseRepository, 'updateDecisionStatus').mockImplementationOnce(() => {
      throw new Error()
    })

    // WHEN
    await expect(usecase.execute(decisionId, decisionStatus))
      // THEN
      .rejects.toThrowError(Error)
  })
})
