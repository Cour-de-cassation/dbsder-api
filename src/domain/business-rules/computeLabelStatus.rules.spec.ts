import { computeLabelStatus } from './computeLabelStatus.rules'
import { MockUtils } from '../../infrastructure/utils/mock.utils'
import { LabelStatus } from 'dbsder-api-types'

describe('updateLabelStatus', () => {
  let mockUtils: MockUtils

  beforeAll(async () => {
    mockUtils = new MockUtils()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('ComputeLabelStatusRules', () => {
    describe('Tests decision NAC code', () => {
      it('when NAC code is not in NAC code database collection', async () => {
        // GIVEN
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          NACCode: '123E'
        }
        const expectedLabelStatus = LabelStatus.IGNORED_CODE_NAC_INCONNU

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, null)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('when NAC code is obsolete', async () => {
        // GIVEN
        const mockDecisionLabel = {
          ...mockUtils.decisionModel
        }
        const expectedLabelStatus = LabelStatus.IGNORED_CODE_NAC_OBSOLETE
        const providedCodeNAC = {
          ...mockUtils.codeNACMock,
          categoriesToOmitTJ: null,
          blocOccultationTJ: 0
        }

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, providedCodeNAC)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })
    })

    describe('Tests on decision publicity', () => {
      it('when decision is not public', async () => {
        // GIVEN
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          public: false
        }
        const providedCodeNAC = mockUtils.codeNACMock
        const expectedLabelStatus = LabelStatus.IGNORED_DECISION_NON_PUBLIQUE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, providedCodeNAC)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('when the NAC code indicates that decision is not public', () => {
        // GIVEN
        const mockDecisionLabel = {
          ...mockUtils.decisionModel
        }
        const providedCodeNAC = {
          ...mockUtils.codeNACMock,
          indicateurDecisionRenduePubliquement: false
        }
        const expectedLabelStatus = LabelStatus.IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, providedCodeNAC)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('when zoning indicates that decision is not public', () => {
        // GIVEN
        const originalTextZoning = {
          is_public: 0,
          arret_id: 1
        }
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          originalTextZoning: originalTextZoning
        }
        const expectedLabelStatus = LabelStatus.IGNORED_DECISION_NON_PUBLIQUE_PAR_ZONAGE
        const providedCodeNAC = {
          ...mockUtils.codeNACMock
        }

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, providedCodeNAC)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })
    })

    describe('Tests on debat publicity', () => {
      it('when court indicates that debat are public but NAC code indicates that debat are not public', () => {
        // GIVEN
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          debatPublic: true
        }
        const providedCodeNAC = {
          ...mockUtils.codeNACMock,
          indicateurDebatsPublics: false
        }
        const expectedLabelStatus = LabelStatus.IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, providedCodeNAC)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('when court indicates that debat are public but zoning indicates that debat are not public', () => {
        // GIVEN
        const originalTextZoning = {
          is_public: 2,
          arret_id: 1
        }
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          debatPublic: true,
          originalTextZoning: originalTextZoning
        }
        const providedCodeNAC = {
          ...mockUtils.codeNACMock,
          indicateurDebatsPublics: true
        }
        const expectedLabelStatus = LabelStatus.IGNORED_DECISION_PARTIELLEMENT_PUBLIQUE_PAR_ZONAGE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, providedCodeNAC)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })
    })
  })

  describe('Tests if all filters passed', () => {
    it('when court indicates that debat are not public', () => {
      // GIVEN
      const mockDecisionLabel = {
        ...mockUtils.decisionModel,
        public: true,
        debatPublic: false
      }
      const expectedLabelStatus = LabelStatus.TOBETREATED
      const providedCodeNAC = {
        ...mockUtils.codeNACMock,
        indicateurDecisionRenduePubliquement: true,
        indicateurDebatsPublics: true
      }

      // WHEN
      mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, providedCodeNAC)

      // THEN
      expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
    })
  })
})
