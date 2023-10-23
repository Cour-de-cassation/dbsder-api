import { mock, MockProxy } from 'jest-mock-extended'
import { RapportOccultation } from '../infrastructure/dto/updateDecision.dto'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { UpdateRapportsOccultationsUsecase } from './updateRapportsOccultations.usecase'

describe('UpdateRapportsOccultationsUsecase', () => {
  const mockDecisionsRepository: MockProxy<InterfaceDecisionsRepository> =
    mock<InterfaceDecisionsRepository>()
  const usecase: UpdateRapportsOccultationsUsecase = new UpdateRapportsOccultationsUsecase(
    mockDecisionsRepository
  )
  const decisionId = 'some-id'
  const decisionConcealmentReports: RapportOccultation[] = mock<RapportOccultation[]>()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns decision ID when decision is successfully updated', async () => {
    // GIVEN
    const decisionId = 'some-id'
    jest
      .spyOn(mockDecisionsRepository, 'updateRapportsOccultations')
      .mockImplementationOnce(() => Promise.resolve(decisionId))

    // WHEN
    const result = await usecase.execute(decisionId, decisionConcealmentReports)

    // THEN
    expect(result).toEqual(decisionId)
  })

  it('propagates an Error when repository returns an error', async () => {
    // GIVEN
    jest.spyOn(mockDecisionsRepository, 'updateRapportsOccultations').mockImplementationOnce(() => {
      throw new Error()
    })

    // WHEN
    await expect(usecase.execute(decisionId, decisionConcealmentReports))
      // THEN
      .rejects.toThrowError(Error)
  })
})
