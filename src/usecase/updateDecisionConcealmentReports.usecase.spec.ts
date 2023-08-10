import { mock, MockProxy } from 'jest-mock-extended'
import { RapportOccultation } from '../infrastructure/dto/updateDecision.dto'
import { IDatabaseRepository } from '../infrastructure/db/database.repository.interface'
import { UpdateDecisionConcealmentReportsUsecase } from './updateDecisionConcealmentReports.usecase'

describe('UpdateDecisionConcealmentReportsUsecase', () => {
  const mockDatabaseRepository: MockProxy<IDatabaseRepository> = mock<IDatabaseRepository>()
  const usecase: UpdateDecisionConcealmentReportsUsecase =
    new UpdateDecisionConcealmentReportsUsecase(mockDatabaseRepository)
  const decisionId = 'some-id'
  const decisionConcealmentReports: RapportOccultation[] = mock<RapportOccultation[]>()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns decision ID when decision is successfully updated', async () => {
    // GIVEN
    const decisionId = 'some-id'
    jest
      .spyOn(mockDatabaseRepository, 'updateDecisionConcealmentReports')
      .mockImplementationOnce(() => Promise.resolve(decisionId))

    // WHEN
    const result = await usecase.execute(decisionId, decisionConcealmentReports)

    // THEN
    expect(result).toEqual(decisionId)
  })

  it('propagates an Error when repository returns an error', async () => {
    // GIVEN
    jest
      .spyOn(mockDatabaseRepository, 'updateDecisionConcealmentReports')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    // WHEN
    await expect(usecase.execute(decisionId, decisionConcealmentReports))
      // THEN
      .rejects.toThrowError(Error)
  })
})
