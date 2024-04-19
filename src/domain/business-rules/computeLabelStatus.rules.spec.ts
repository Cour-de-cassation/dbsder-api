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
    describe('Returns labelStatus with IGNORED_CODE_NAC_INCONNU -- IGNORED_CODE_NAC_OBSOLETE', () => {
      it('returns ignored_codeNACInconnu when we have null from codenac table in database', async () => {
        // GIVEN
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          NACCode: '123E',
          public: false,
          _id: mockUtils.decisionModel._id.toString()
        }

        const expectedLabelStatus = LabelStatus.IGNORED_CODE_NAC_INCONNU

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, null)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('returns ignored_codeNacObsolete when blocOccultation == 0 or categoriesToOmit == null', async () => {
        // GIVEN
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          public: false,
          _id: mockUtils.decisionModel._id.toString()
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

    describe('Returns labelStatus with IGNORED_DECISION_NON_PUBLIQUE', () => {
      it('returns ignored_decisionNonPublique when decision is not public', async () => {
        // GIVEN
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          public: false,
          _id: mockUtils.decisionModel._id.toString()
        }

        const providedCodeNAC = mockUtils.codeNACMock

        const expectedLabelStatus = LabelStatus.IGNORED_DECISION_NON_PUBLIQUE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, providedCodeNAC)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })
    })

    describe('Returns IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE -- IGNORED_DECISION_NON_PUBLIQUE_PAR_ZONAGE -- IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE -- IGNORED_DECISION_PARTIELLEMENT_PUBLIQUE_PAR_ZONAGE status', () => {

      it('returns ignored_codeNACdeDecisionNonPublique when decision is not public', () => {
        // GIVEN
        const originalTextZoning = {
          is_public: 1,
          arret_id: 1
        }
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          debatPublic: true,
          originalTextZoning: originalTextZoning,
          _id: mockUtils.decisionModel._id.toString()
        }
        const providedCodeNAC = {
          ...mockUtils.codeNACMock,
          indicateurDecisionRenduePubliquement: false,
          indicateurDebatsPublics: true
        }
        const expectedLabelStatus = LabelStatus.IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, providedCodeNAC)
        // THEN

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('returns ignored_decisionNonPubliqueParZonage when decision is not public', () => {
        // GIVEN
        const originalTextZoning = {
          is_public: 0,
          arret_id: 1
        }
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          CodeNAC: '45E',
          originalTextZoning: originalTextZoning,
          _id: mockUtils.decisionModel._id.toString()
        }
        const expectedLabelStatus = LabelStatus.IGNORED_DECISION_NON_PUBLIQUE_PAR_ZONAGE
        const providedCodeNAC = {
          ...mockUtils.codeNACMock,
          indicateurDecisionRenduePubliquement: true
        }

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, providedCodeNAC)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('returns ignored_codeNACdeDecisionPartiellementPublique when decision is not public', () => {
        // GIVEN
        const originalTextZoning = {
          is_public: 1,
          arret_id: 1
        }
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          debatPublic: true,
          originalTextZoning: originalTextZoning,
          _id: mockUtils.decisionModel._id.toString()
        }
        const providedCodeNAC = {
          ...mockUtils.codeNACMock,
          indicateurDecisionRenduePubliquement: true,
          indicateurDebatsPublics: false
        }
        const expectedLabelStatus = LabelStatus.IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE
        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, providedCodeNAC)
        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('returns ignored_DecisionPartiellementPublicParZonage when decision is not public', () => {
        // GIVEN
        const originalTextZoning = {
          is_public: 2,
          arret_id: 1
        }
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          debatPublic: true,
          originalTextZoning: originalTextZoning,
          _id: mockUtils.decisionModel._id.toString()
        }
        const providedCodeNAC = {
          ...mockUtils.codeNACMock,
          indicateurDecisionRenduePubliquement: true,
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

  describe('Returns TOBETREATED LabelStatus', () => {
    //exceptional
    it('returns TOBETREATED when decision debat is not public', () => {
      // GIVEN
      const originalTextZoning = {
        is_public: 1,
        arret_id: 1
      }
      const mockDecisionLabel = {
        ...mockUtils.decisionModel,
        originalTextZoning: originalTextZoning,
        debatPublic: true,
        _id: mockUtils.decisionModel._id.toString()
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

    it('when decision is not ignored ', () => {
      // GIVEN
      const dateDecember2023 = new Date(2023, 11, 31)
      const dateMarch2024 = new Date(2024, 2, 29)
      const originalTextZoning = {
        is_public: 1,
        arret_id: 1
      }
      const mockDecisionLabel = {
        ...mockUtils.decisionModel,
        originalTextZoning: originalTextZoning,
        _id: mockUtils.decisionModel._id.toString(),
        dateDecision: dateDecember2023.toISOString(),
        dateCreation: dateMarch2024.toISOString(),
        public: true
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
