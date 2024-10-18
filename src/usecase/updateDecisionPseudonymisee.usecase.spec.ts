import { mock, MockProxy } from 'jest-mock-extended'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { UpdateDecisionPseudonymiseeUsecase } from './updateDecisionPseudonymisee.usecase'
import { LabelStatus, LabelTreatment, PublishStatus } from 'dbsder-api-types'
import { MockUtils } from '../infrastructure/utils/mock.utils'

describe('UpdateDecisionPseudonymiseeUsecase', () => {
  const mockDecisionsRepository: MockProxy<InterfaceDecisionsRepository> =
    mock<InterfaceDecisionsRepository>()
  const usecase: UpdateDecisionPseudonymiseeUsecase = new UpdateDecisionPseudonymiseeUsecase(
    mockDecisionsRepository
  )
  const mockUtils = new MockUtils()
  const decisionId = 'some-id'
  const decisionPseudonymisedDecision = 'some-PseudonymisedDecision'
  const publishStatus = PublishStatus.PENDING
  const labelStatus = LabelStatus.BLOCKED
  const labelTreatments: LabelTreatment[] =  mockUtils.decisionRapportsOccultations.rapportsOccultations
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns decision ID when decision is successfully updated', async () => {
    // GIVEN
    const decisionId = 'some-id'
    jest
      .spyOn(mockDecisionsRepository, 'updateDecisionPseudonymisee')
      .mockImplementationOnce(() => Promise.resolve(decisionId))

    // WHEN
    const result = await usecase.execute(decisionId, decisionPseudonymisedDecision, publishStatus,)

    // THEN
    expect(result).toEqual(decisionId)
  })

  it('propagates an Error when repository returns an error', async () => {
    // GIVEN
    jest
      .spyOn(mockDecisionsRepository, 'updateDecisionPseudonymisee')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    // WHEN
    await expect(usecase.execute(decisionId, decisionPseudonymisedDecision, publishStatus,))
      // THEN
      .rejects.toThrowError(Error)
  })
})
