import { computePublishStatus } from './computePublishStatus.rules'
import { MockUtils } from '../../infrastructure/utils/mock.utils'
import { LabelStatus, PublishStatus } from 'dbsder-api-types'

describe('computePublishStatus', () => {
  let mockUtils: MockUtils

  beforeAll(async () => {
    mockUtils = new MockUtils()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('computePublishStatusRules', () => {
    it('when labelStatus is toBeTreated', async () => {
      // GIVEN
      const givenDecision = {
        ...mockUtils.decisionModel,
        labelStatus: LabelStatus.TOBETREATED
      }
      const expectedPublishStatus = PublishStatus.TOBEPUBLISHED

      // WHEN
      givenDecision.publishStatus = computePublishStatus(givenDecision)

      // THEN
      expect(givenDecision.publishStatus).toEqual(expectedPublishStatus)
    })

    it('when labelStatus is done', async () => {
      // GIVEN
      const givenDecision = {
        ...mockUtils.decisionModel,
        labelStatus: LabelStatus.DONE
      }
      const expectedPublishStatus = PublishStatus.TOBEPUBLISHED

      // WHEN
      givenDecision.publishStatus = computePublishStatus(givenDecision)

      // THEN
      expect(givenDecision.publishStatus).toEqual(expectedPublishStatus)
    })

    Object.keys(LabelStatus).forEach((labelStatusKey) => {
      const labelStatusValue = LabelStatus[labelStatusKey as keyof typeof LabelStatus]
      if (labelStatusValue !== LabelStatus.TOBETREATED && labelStatusValue !== LabelStatus.DONE) {
        it(`when labelStatus is ${labelStatusValue}`, async () => {
          // GIVEN
          const givenDecision = {
            ...mockUtils.decisionModel,
            labelStatus: labelStatusValue
          }
          const expectedPublishStatus = PublishStatus.BLOCKED

          // WHEN
          givenDecision.publishStatus = computePublishStatus(givenDecision)

          // THEN
          expect(givenDecision.publishStatus).toEqual(expectedPublishStatus)
        })
      }
    })
  })
})
