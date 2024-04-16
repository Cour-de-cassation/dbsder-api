import { computeLabelStatus } from './computeLabelStatus.utils'
import { MockUtils } from './mock.utils'
import { LabelStatus } from 'dbsder-api-types'

describe('updateLabelStatus', () => {
  let mockUtils: MockUtils

  beforeAll(async () => {
    mockUtils = new MockUtils()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('Changes labelStatus if it has exceptions', () => {
    describe('Returns ignored_decisionDateIncoherente', () => {
      it('when dateDecision is in the future compared to dateCreation', () => {
        // GIVEN
        const dateDecisionInTheFuture = new Date(2023, 7, 20)
        const dateCreation = new Date(2023, 6, 20)
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          dateDecision: dateDecisionInTheFuture.toISOString(),
          dateCreation: dateCreation.toISOString(),
          public: true,
          _id: mockUtils.decisionModel._id.toString()
        }
        const expectedLabelStatus = LabelStatus.IGNORED_DATE_DECISION_INCOHERENTE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('when decision is older than 6 months', () => {
        // GIVEN
        const dateDecisionSevenMonthsBefore = new Date(2022, 11, 15)
        const dateCreation = new Date(2023, 6, 20)
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          dateDecision: dateDecisionSevenMonthsBefore.toISOString(),
          dateCreation: dateCreation.toISOString(),
          public: true,
          _id: mockUtils.decisionModel._id.toString()
        }
        const expectedLabelStatus = LabelStatus.IGNORED_DATE_DECISION_INCOHERENTE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })
    })

    describe('returns ignored_dateAvantMiseEnService', () => {
      it('when decisionDate is before mise en service date', () => {
        // GIVEN
        const dateDecisionBeforeMiseEnService = new Date(2023, 11, 13)
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          dateDecision: dateDecisionBeforeMiseEnService.toISOString(),
          _id: mockUtils.decisionModel._id.toString()
        }
        const expectedLabelStatus = LabelStatus.IGNORED_DATE_AVANT_MISE_EN_SERVICE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('when decisionDate is in January 2023 and dateCreation is in July 2023', () => {
        // GIVEN
        const dateJanuary2023 = new Date(2023, 0, 15)
        const dateJuly2023 = new Date(2023, 6, 20)
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          dateDecision: dateJanuary2023.toISOString(),
          dateCreation: dateJuly2023.toISOString(),
          _id: mockUtils.decisionModel._id.toString()
        }
        // change with new condditions now this is before mise en service
        const expectedLabelStatus = LabelStatus.IGNORED_DATE_AVANT_MISE_EN_SERVICE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('when decisionDate is in September 2022 and dateCreation is in March 2023', () => {
        // GIVEN
        const dateSeptember2022 = new Date(2022, 8, 20)
        const dateMarch2023 = new Date(2023, 2, 25)
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          dateDecision: dateSeptember2022.toISOString(),
          dateCreation: dateMarch2023.toISOString(),
          _id: mockUtils.decisionModel._id.toString()
        }
        const expectedLabelStatus = LabelStatus.IGNORED_DATE_AVANT_MISE_EN_SERVICE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })
    })

    describe('Returns labelStatus with IGNORED_DECISION_NON_PUBLIQUE  -- IGNORED_CODE_DECISION_BLOQUE_CC -- IGNORED_CARACTERE_INCONNU', () => {
      it('returns ignored_decisionNonPublique when decision is not public', async () => {
        // GIVEN
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          endCaseCode: '11E',
          public: false,
          _id: mockUtils.decisionModel._id.toString()
        }

        const providedCodeNAC = mockUtils.codeNACMock

        const expectedLabelStatus = LabelStatus.IGNORED_DECISION_NON_PUBLIQUE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, '', providedCodeNAC)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('returns ignored_codeDecisionBloqueCC when endCaseCode (codeDecision) is not in the list of codeDecision that needs to be transmitted to CC', () => {
        // GIVEN
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          endCaseCode: '32A',
          _id: mockUtils.decisionModel._id.toString()
        }
        const expectedLabelStatus = LabelStatus.IGNORED_CODE_DECISION_BLOQUE_CC

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('when originalText contains tibetan characters', () => {
        // GIVEN

        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          endCaseCode: '11E',
          _id: mockUtils.decisionModel._id.toString(),
          originalText:
            'La créance des tiers payeurs et déduction faite des provisions à hauteur de 9. 000 སྒྱ, en réparation de son préjudice corporel, consécutif à l’accident survenu le'
        }
        const providedCodeNAC = mockUtils.codeNACMock
        const expectedLabelStatus = LabelStatus.IGNORED_CARACTERE_INCONNU

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, '', providedCodeNAC)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })
    })

    // les deux cas que l'on a rajouté
    describe('Returns ignored status with zonage attributes', () => {
      it('returns ignored_decisionNonPubliqueParZonage when decision is not public', () => {
        // GIVEN
        const originalTextZoning = {
          is_public: 0,
          arret_id: 1
        }
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          endCaseCode: '11E',
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
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, '', providedCodeNAC)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('returns ignored_codeNACCDecisionPartiellementPublicParZonage when decision is not public', () => {
        // GIVEN
        const originalTextZoning = {
          is_public: 2,
          arret_id: 1
        }
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          endCaseCode: '11E',
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
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, '', providedCodeNAC)
        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })
    })

    describe('Returns IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE with table nac indicateur decision public == false', () => {
      it('returns IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE when decision is not public', () => {
        // GIVEN
        const originalTextZoning = {
          is_public: 2,
          arret_id: 1
        }
        const mockDecisionLabel = {
          ...mockUtils.decisionModel,
          endCaseCode: '11E',
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
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, '', providedCodeNAC)
        // THEN

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
        endCaseCode: '11E',
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
      mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, '', providedCodeNAC)

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
        endCaseCode: '11E',
        dateDecision: dateDecember2023.toISOString(),
        dateCreation: dateMarch2024.toISOString(),
        public: true
      }
      const expectedLabelStatus = LabelStatus.TOBETREATED
      const providedCodeNAC = mockUtils.codeNACMock

      // WHEN
      mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, '', providedCodeNAC)

      // THEN
      expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
    })

    it(`when decision endCaseCode (codeDecision) is in transmissible codeDecision list`, () => {
      // GIVEN
      const originalTextZoning = {
        is_public: 1,
        arret_id: 1
      }
      const mockDecisionLabel = {
        ...mockUtils.decisionModel,
        originalTextZoning: originalTextZoning,
        endCaseCode: '11E',
        _id: mockUtils.decisionModel._id.toString()
      }
      const expectedLabelStatus = LabelStatus.TOBETREATED
      const providedCodeNAC = mockUtils.codeNACMock

      // WHEN
      mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel, '', providedCodeNAC)

      // THEN
      expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
    })
  })
})
