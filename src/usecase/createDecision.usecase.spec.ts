import { mock, MockProxy } from 'jest-mock-extended'
import { MockUtils } from '../infrastructure/utils/mock.utils'
import { CreateDecisionUsecase } from './createDecision.usecase'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { CodeNACsRepository } from '../infrastructure/db/repositories/codeNACs.repository'
import { LabelStatus, Occultation, Sources } from 'dbsder-api-types'
import { FakeZoningApiService } from '../service/fakeZoningApi.service'
import { ZoningApiService } from '../service/zoningApi.service'

describe('createDecisionUsecase', () => {
  const mockDecisionsRepository: MockProxy<InterfaceDecisionsRepository> =
    mock<InterfaceDecisionsRepository>()
  const mockCodeNACsRepository: MockProxy<CodeNACsRepository> = mock<CodeNACsRepository>()
  const fakeZoningApiService: ZoningApiService = new FakeZoningApiService()
  let mockUtils: MockUtils
  const usecase: CreateDecisionUsecase = new CreateDecisionUsecase(
    mockDecisionsRepository,
    mockCodeNACsRepository,
    fakeZoningApiService
  )

  beforeAll(async () => {
    mockUtils = new MockUtils()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('Success cases', () => {
    it('when decision is from TJ, creates decision and add occultation based on codeNAC successfully', async () => {
      // GIVEN
      const providedCodeNAC = mockUtils.codeNACMock
      const expectedDecision = {
        ...mockUtils.decisionModel,
        debatPublic: false,
        recommandationOccultation: Occultation.CONFORME,
        sourceName: Sources.TJ
      }
      const providedDecision = {
        ...expectedDecision,
        _id: expectedDecision._id.toString(),
        dateImport: new Date().toISOString(),
        datePublication: null
      }

      jest
        .spyOn(mockDecisionsRepository, 'create')
        .mockImplementationOnce(async () => expectedDecision._id.toString())

      jest
        .spyOn(mockCodeNACsRepository, 'getByCodeNac')
        .mockImplementationOnce(async () => providedCodeNAC)

      // WHEN
      const result = await usecase.execute(providedDecision)

      // THEN
      expect(result).toEqual(expectedDecision._id.toString())
      expect(mockDecisionsRepository.create).toHaveBeenCalledWith({
        ...providedDecision,
        blocOccultation: providedCodeNAC.blocOccultationTJ,
        occultation: {
          ...providedDecision.occultation,
          categoriesToOmit:
            providedCodeNAC.categoriesToOmitTJ[providedDecision.recommandationOccultation]
        }
      })
    })

    it('When decision is from CA or CC, creates decision successfully with no added occultation', async () => {
      // GIVEN
      const expectedDecision = mockUtils.decisionModel
      const providedDecision = {
        ...expectedDecision,
        _id: expectedDecision._id.toString(),
        sourceName: Sources.CC,
        dateImport: new Date().toISOString(),
        datePublication: null
      }
      const providedCodeNAC = mockUtils.codeNACMock

      jest
        .spyOn(mockDecisionsRepository, 'create')
        .mockImplementationOnce(async () => expectedDecision._id.toString())

      jest
        .spyOn(mockCodeNACsRepository, 'getByCodeNac')
        .mockImplementationOnce(async () => providedCodeNAC)

      // WHEN
      const result = await usecase.execute(providedDecision)

      // THEN
      expect(result).toEqual(expectedDecision._id.toString())
    })

    it('Creates decision without added occultation when decision is not from TJ and tobeTreated', async () => {
      // GIVEN
      const nonPublicCodeNAC = '11A'
      const expectedDecision = {
        ...mockUtils.decisionModel,
        NACCode: nonPublicCodeNAC
      }
      const providedDecision = {
        ...expectedDecision,
        _id: expectedDecision._id.toString(),
        labelStatus: LabelStatus.IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE,
        dateImport: new Date().toISOString(),
        datePublication: null
      }

      jest
        .spyOn(mockDecisionsRepository, 'create')
        .mockImplementationOnce(async () => expectedDecision._id.toString())

      // WHEN
      const result = await usecase.execute(providedDecision)

      // THEN
      expect(result).toEqual(expectedDecision._id.toString())
    })
  })

  describe('Error cases', () => {
    it('When decision is from TJ and codeNAC is not found inside codenacs collection in database, it is saved with an ignored labelStatus', async () => {
      // GIVEN
      const expectedDecision = {
        ...mockUtils.decisionModel,
        recommandationOccultation: Occultation.CONFORME,
        sourceName: Sources.TJ,
        NACCode: 'XX0'
      }
      const providedDecision = {
        ...expectedDecision,
        _id: expectedDecision._id.toString(),
        dateImport: new Date().toISOString(),
        datePublication: null
      }

      jest.spyOn(mockCodeNACsRepository, 'getByCodeNac').mockImplementationOnce(async () => null)
      jest
        .spyOn(mockDecisionsRepository, 'create')
        .mockImplementationOnce(async () => expectedDecision._id.toString())

      // WHEN
      const result = await usecase.execute(providedDecision)

      // THEN
      expect(result).toEqual(expectedDecision._id.toString())
      expect(mockDecisionsRepository.create).toHaveBeenCalledWith({
        ...providedDecision,
        labelStatus: LabelStatus.IGNORED_CODE_NAC_INCONNU
      })
    })

    it('propagates an Error when repository returns an error', async () => {
      // GIVEN
      const rejectedDecision = {
        ...mockUtils.createDecisionDTO,
        dateImport: new Date().toISOString(),
        datePublication: null
      }
      jest.spyOn(mockDecisionsRepository, 'create').mockImplementationOnce(() => {
        throw new Error()
      })
      // WHEN
      await expect(usecase.execute(rejectedDecision))
        // THEN
        .rejects.toThrow(Error)
    })
  })
})
