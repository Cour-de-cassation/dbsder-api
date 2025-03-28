import { MockUtils } from '../infrastructure/utils/mock.utils'
import { FindDecisionRouteUseCase } from './findDecisionRoute.usecase'
import { CodeNACsRepository } from '../infrastructure/db/repositories/codeNACs.repository'
import { mock, MockProxy } from 'jest-mock-extended'
import { LabelRoute } from 'dbsder-api-types'

describe('FindDecisionRouteUseCase', () => {
  const mockCodeNACsRepository: MockProxy<CodeNACsRepository> = mock<CodeNACsRepository>()
  const mockUtils = new MockUtils()
  const usecase = new FindDecisionRouteUseCase(mockCodeNACsRepository)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('Return route based on codeNAC', () => {
    it('returns routeRelecture when codeNAC exists', async () => {
      // GIVEN
      const codeNac = 'codeNac1'
      const givenCodeNAC = { ...mockUtils.codeNACMock, routeRelecture: LabelRoute.AUTOMATIC }

      jest.spyOn(mockCodeNACsRepository, 'getByCodeNac').mockResolvedValue(givenCodeNAC)

      // WHEN
      const result = await usecase.execute(codeNac)

      // THEN
      expect(result).toBe(LabelRoute.AUTOMATIC.toLocaleLowerCase())
    })

    it('returns undefined when codeNAC does not exist', async () => {
      // GIVEN
      const codeNac = 'codeNac1'

      jest.spyOn(mockCodeNACsRepository, 'getByCodeNac').mockResolvedValue(null)

      // WHEN
      const result = await usecase.execute(codeNac)

      // THEN
      expect(result).toBeUndefined()
    })
  })
})
