import { expect, jest } from '@jest/globals'
import { ObjectId } from 'mongodb'

import * as sderDB from '../../library/sderDB'
import * as rulesLabel from './rulesLabel'
import { DecisionTj, LabelStatus } from 'dbsder-api-types'
import {
  BlocOccultation,
  PublishStatus,
  SuiviOccultation
} from 'dbsder-api-types/dist/types/common'
import { UpdatableDecisionFields } from './models'

const findAndUpdateDecision = jest.spyOn(sderDB, 'findAndUpdateDecision')

const fakeDecision = (id: ObjectId): DecisionTj => ({
  _id: id,
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
  debatPublic: false,
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
  publication: []
})

describe('service/decision/rulesLabel', () => {
  beforeEach(() => {
    findAndUpdateDecision.mockReset()
  })

  describe('updateDecisionForLabel', () => {
    it('should throw an error if decision is not find', async () => {
      const id = new ObjectId()
      const decision = fakeDecision(id)

      findAndUpdateDecision.mockReturnValue(Promise.resolve(null))

      await expect(async () => {
        await rulesLabel.updateDecisionForLabel(decision, {})
      }).rejects.toThrow(/not found/)
    })

    it('should update with expected', async () => {
      const id = new ObjectId()
      const decision = fakeDecision(id)
      const updateFields: Omit<UpdatableDecisionFields, 'labelStatus' | 'publishStatus'> = {
        pseudoText: 'this is a pseudotext',
        labelTreatments: [
          {
            order: 1,
            annotations: [],
            source: ''
          },
          {
            order: 2,
            annotations: [],
            source: ''
          }
        ]
      }

      // return something
      findAndUpdateDecision.mockReturnValue(Promise.resolve(decision)) 

      await rulesLabel.updateDecisionForLabel(decision, updateFields)

      expect(findAndUpdateDecision.mock.lastCall?.[0]).toEqual({ _id: id, sourceName: decision.sourceName })
      expect(findAndUpdateDecision.mock.lastCall?.[1].pseudoText).toEqual(updateFields.pseudoText)
      expect(findAndUpdateDecision.mock.lastCall?.[1].labelTreatments).toEqual(
        updateFields.labelTreatments
      )
    })

    it('should ask for publication only if decision is not blocked ', async () => {
      const firstId = new ObjectId()
      const firstDecision = { ...fakeDecision(firstId), publishStatus: PublishStatus.SUCCESS }
      const secondId = new ObjectId()
      const secondDecision = { ...fakeDecision(secondId), publishStatus: PublishStatus.BLOCKED }

      // return something
      findAndUpdateDecision.mockReturnValue(Promise.resolve(firstDecision)) 

      await rulesLabel.updateDecisionForLabel(firstDecision, {})

      expect(findAndUpdateDecision.mock.lastCall?.[0]).toEqual({ _id: firstId, sourceName: firstDecision.sourceName })
      expect(findAndUpdateDecision.mock.lastCall?.[1].publishStatus).toEqual(
        PublishStatus.TOBEPUBLISHED
      )

      await rulesLabel.updateDecisionForLabel(secondDecision, {})

      expect(findAndUpdateDecision.mock.lastCall?.[0]).toEqual({ _id: secondId, sourceName: secondDecision.sourceName })
      expect(findAndUpdateDecision.mock.lastCall?.[1].publishStatus).toEqual(PublishStatus.BLOCKED)
    })

    it('should add new labelTreatments to previous', async () => {
      const id = new ObjectId()

      const decision = {
        ...fakeDecision(id),
        labelTreatments: [
          {
            order: 1,
            annotations: [],
            source: 'original'
          },
          {
            order: 2,
            annotations: [],
            source: 'original'
          },
          {
            order: 3,
            annotations: [],
            source: 'original'
          }
        ]
      }

      const updateFields: Omit<UpdatableDecisionFields, 'labelStatus' | 'publishStatus'> = {
        pseudoText: 'this is a pseudotext',
        labelTreatments: [
          {
            order: 1,
            annotations: [],
            source: 'new'
          },
          {
            order: 2,
            annotations: [],
            source: 'new'
          }
        ]
      }

      // return something
      findAndUpdateDecision.mockReturnValue(Promise.resolve(decision)) 

      await rulesLabel.updateDecisionForLabel(decision, updateFields)

      expect(findAndUpdateDecision.mock.lastCall?.[0]).toEqual({ _id: id, sourceName: decision.sourceName })
      expect(findAndUpdateDecision.mock.lastCall?.[1].labelTreatments).toEqual([
        {
          order: 1,
          annotations: [],
          source: 'original'
        },
        {
          order: 2,
          annotations: [],
          source: 'original'
        },
        {
          order: 3,
          annotations: [],
          source: 'original'
        },
        {
          order: 4,
          annotations: [],
          source: 'new'
        },
        {
          order: 5,
          annotations: [],
          source: 'new'
        }
      ])
    })
  })

  afterAll(() => {
    findAndUpdateDecision.mockRestore()
  })
})
