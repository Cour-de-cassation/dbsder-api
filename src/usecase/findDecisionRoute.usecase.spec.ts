import { MockUtils } from '../infrastructure/utils/mock.utils'
import { FindDecisionRouteUseCase } from './findDecisionRoute.usecase'
import { CodeNACsRepository } from '../infrastructure/db/repositories/codeNACs.repository'
import { CodeDecisionRepository } from '../infrastructure/db/repositories/codeDecision.repository'
import { mock, MockProxy } from 'jest-mock-extended'
import { Sources } from 'dbsder-api-types'

describe('FindDecisionRouteUseCase', () => {
  const mockCodeNACsRepository: MockProxy<CodeNACsRepository> = mock<CodeNACsRepository>()
  const mockCodeDecisionRepository: MockProxy<CodeDecisionRepository> =
    mock<CodeDecisionRepository>()
  const mockUtils = new MockUtils()
  const usecase = new FindDecisionRouteUseCase(mockCodeNACsRepository, mockCodeDecisionRepository)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('Return route when codeDecision overrides NAC', () => {
    it('returns codeDecision route when codeDecision overwritesNAC', async () => {
      // GIVEN
      const codeNac = 'codeNac1'
      const codeDecision = 'codeDecision1'
      const source = Sources.CA
      const givenCodeDecision = {
        ...mockUtils.codeDecisionMock,
        overwritesNAC: true,
        routeCA: 'routeCodeDecision'
      }

      jest
        .spyOn(mockCodeDecisionRepository, 'getByCodeDecision')
        .mockResolvedValue(givenCodeDecision)
      jest.spyOn(mockCodeNACsRepository, 'getByCodeNac').mockResolvedValue(null)

      // WHEN
      const result = await usecase.execute(codeNac, codeDecision, source)

      // THEN
      expect(result).toBe('routecodedecision')
    })

    it('returns routeRelecture when codeDecision does not overwriteNAC and codeNAC exists', async () => {
      // GIVEN
      const codeNac = 'codeNac1'
      const codeDecision = 'codeDecision1'
      const source = Sources.CA
      const givenCodeNAC = { ...mockUtils.codeNACMock, routeRelecture: 'routeNac' }

      jest.spyOn(mockCodeDecisionRepository, 'getByCodeDecision').mockResolvedValue(null)
      jest.spyOn(mockCodeNACsRepository, 'getByCodeNac').mockResolvedValue(givenCodeNAC)

      // WHEN
      const result = await usecase.execute(codeNac, codeDecision, source)

      // THEN
      expect(result).toBe('routenac')
    })

    it('returns undefined when neither givenCodeDecision nor givenCodeNAC exist', async () => {
      // GIVEN
      const codeNac = 'codeNac1'
      const codeDecision = 'codeDecision1'
      const source = Sources.CA

      jest.spyOn(mockCodeDecisionRepository, 'getByCodeDecision').mockResolvedValue(null)
      jest.spyOn(mockCodeNACsRepository, 'getByCodeNac').mockResolvedValue(null)

      // WHEN
      const result = await usecase.execute(codeNac, codeDecision, source)

      // THEN
      expect(result).toBeUndefined()
    })
  })
})
