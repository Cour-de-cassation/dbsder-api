import { expect, jest } from '@jest/globals'
import { ObjectId } from 'mongodb'

import * as sderDB from '../../library/sderDB'
import * as rulesTj from './rulesTj'
import { CodeNac, DecisionTj, LabelStatus } from 'dbsder-api-types'
import { BlocOccultation, Category, SuiviOccultation } from 'dbsder-api-types/dist/types/common'

const findCodeNac = jest.spyOn(sderDB, 'findCodeNac')

const fakeDecision: DecisionTj = {
  _id: new ObjectId(),
  sourceId: 1,
  sourceName: 'juritj',
  __v: 0,
  originalText: 'text',
  registerNumber: '',
  dateCreation: '',
  dateDecision: '',
  jurisdictionCode: '',
  jurisdictionId: '',
  jurisdictionName: '',
  labelStatus: LabelStatus.TOBETREATED,
  NACCode: '',
  NPCode: '',
  libelleNAC: '',
  libelleNatureParticuliere: '',
  endCaseCode: '',
  libelleEndCaseCode: '',
  chamberId: '',
  chamberName: '',
  codeService: '',
  libelleService: '',
  debatPublic: true,
  indicateurQPC: false,
  matiereDeterminee: false,
  pourvoiCourDeCassation: false,
  pourvoiLocal: false,
  selection: false,
  blocOccultation: BlocOccultation.TOUTES_CATAGORIES,
  recommandationOccultation: SuiviOccultation.AUCUNE,
  occultation: { additionalTerms: '', categoriesToOmit: [] },
  parties: [],
  filenameSource: '',
  idDecisionTJ: '',
  numeroRoleGeneral: '',
  appeals: [],
  decatt: [],
  publication: [],
  public: true
}

const codeNac: CodeNac = {
  _id: new ObjectId(),
  indicateurDecisionRenduePubliquement: true,
  codeNAC: '',
  libelleNAC: '',
  niveau1NAC: { code: '', libelle: '' },
  niveau2NAC: { code: '', libelle: '' },
  indicateurAffaireSignalee: false,
  isInJuricaDatabase: true,
  blocOccultationTJ: 1,
  categoriesToOmitCA: { aucune: [], complément: [], conforme: [], substituant: [] },
  categoriesToOmitTJ: { aucune: [], complément: [], conforme: [], substituant: [] },
  logs: [],
  indicateurDebatsPublics: true
}

describe('service/decision/rulesTj', () => {
  beforeEach(() => {
    findCodeNac.mockReset()
  })

  describe('computeRulesDecisionTj', () => {
    it('should be ignored if decision is not public', async () => {
      const decision: DecisionTj = { ...fakeDecision, public: false }
      const result = await rulesTj.computeRulesDecisionTj(decision, undefined)

      expect(result.labelStatus).not.toEqual(LabelStatus.TOBETREATED)
    })

    it('should be ignored if zoning fallback into not public', async () => {
      const decision: DecisionTj = fakeDecision
      const originalTextZoning = { is_public: 0 }
      const result = await rulesTj.computeRulesDecisionTj(decision, originalTextZoning)

      expect(result.labelStatus).not.toEqual(LabelStatus.TOBETREATED)
    })

    it('should be ignored if zoning fallback into partially not public', async () => {
      const decision: DecisionTj = {
        ...fakeDecision,
        debatPublic: true
      }
      const originalTextZoning = { is_public: 2 }
      const result = await rulesTj.computeRulesDecisionTj(decision, originalTextZoning)

      expect(result.labelStatus).not.toEqual(LabelStatus.TOBETREATED)
    })

    it('should be ignored if decision has no codeNac', async () => {
      findCodeNac.mockResolvedValue(null)

      const decision = fakeDecision
      const result = await rulesTj.computeRulesDecisionTj(decision, undefined)

      expect(result.labelStatus).not.toEqual(LabelStatus.TOBETREATED)
    })

    it('should be ignored if not public by code Nac', async () => {
      findCodeNac.mockResolvedValue({ ...codeNac, indicateurDecisionRenduePubliquement: false })
      const decision = fakeDecision
      const result = await rulesTj.computeRulesDecisionTj(decision, undefined)

      expect(result.labelStatus).not.toEqual(LabelStatus.TOBETREATED)
    })

    it('should be ignored if codeNac occultations are undefined', async () => {
      findCodeNac.mockResolvedValue({ ...codeNac, blocOccultationTJ: undefined })
      const decision = fakeDecision
      const result = await rulesTj.computeRulesDecisionTj(decision, undefined)

      expect(result.labelStatus).not.toEqual(LabelStatus.TOBETREATED)
    })

    it('should be ignored if partially not public by nac', async () => {
      findCodeNac.mockResolvedValue({ ...codeNac, indicateurDebatsPublics: false })
      const decision = fakeDecision
      const result = await rulesTj.computeRulesDecisionTj(decision, undefined)

      expect(result.labelStatus).not.toEqual(LabelStatus.TOBETREATED)
    })

    it('should be treated otherwise', async () => {
      findCodeNac.mockResolvedValue(codeNac)
      const decision = fakeDecision
      const result = await rulesTj.computeRulesDecisionTj(decision, undefined)

      expect(result.labelStatus).toEqual(LabelStatus.TOBETREATED)
    })

    it('should return decision with codeNac categoriesToOmit', async () => {
      const categoriesToOmit = [Category.ADRESSE]
      findCodeNac.mockResolvedValue({
        ...codeNac,
        categoriesToOmitTJ: {
          aucune: [],
          complément: categoriesToOmit,
          conforme: [],
          substituant: []
        }
      })
      const decision = { ...fakeDecision, recommandationOccultation: SuiviOccultation.COMPLEMENT }
      const result = await rulesTj.computeRulesDecisionTj(decision, undefined)

      expect(result.occultation.categoriesToOmit).toEqual(categoriesToOmit)
    })

    it('should return decision with codeNac blocOccultation', async () => {
      const blocOccultation = 3
      findCodeNac.mockResolvedValue({ ...codeNac, blocOccultationTJ: blocOccultation })
      const decision = fakeDecision
      const result = await rulesTj.computeRulesDecisionTj(decision, undefined)

      expect(result.blocOccultation).toEqual(blocOccultation)
    })
  })

  afterAll(() => {
    findCodeNac.mockRestore()
  })
})
