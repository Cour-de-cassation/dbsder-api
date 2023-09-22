import { Sources, LabelStatus } from 'dbsder-api-types'
import { GetDecisionsListDto } from '../infrastructure/dto/getDecisionsList.dto'
import { mapDecisionSearchParametersToFindCriterias } from './decisionSearchCriteria'

describe('decisionSearchCriteria', () => {
  describe('mapDecisionSearchParametersToFindCriterias', () => {
    const todayDate = new Date().toISOString().slice(0, 10)

    it('should map decision search params to findCriterias with correct parameters', () => {
      // GIVEN
      const decisionSearchParams: GetDecisionsListDto = {
        source: Sources.CA,
        status: LabelStatus.TOBETREATED,
        startDate: '2020-01-01',
        number: '123'
      }

      const expectedFindCriterias = {
        sourceName: Sources.CA,
        labelStatus: LabelStatus.TOBETREATED,
        dateCreation: {
          $gte: '2020-01-01',
          $lte: todayDate
        },
        $or: [
          {
            numeroRoleGeneral: '123'
          },
          { appeals: '123' }
        ]
      }

      // WHEN
      const findCriterias = mapDecisionSearchParametersToFindCriterias(decisionSearchParams)

      // THEN
      expect(findCriterias).toEqual(expectedFindCriterias)
    })

    it('should map decision search params to findCriterias without all parameters', () => {
      // GIVEN
      const decisionSearchParams: GetDecisionsListDto = {
        source: Sources.CA,
        status: LabelStatus.TOBETREATED,
        number: '123'
      }

      const expectedFindCriterias = {
        sourceName: Sources.CA,
        labelStatus: LabelStatus.TOBETREATED,
        $or: [
          {
            numeroRoleGeneral: '123'
          },
          { appeals: '123' }
        ]
      }

      // WHEN
      const findCriterias = mapDecisionSearchParametersToFindCriterias(decisionSearchParams)

      // THEN
      expect(findCriterias).toEqual(expectedFindCriterias)
    })
  })
})
