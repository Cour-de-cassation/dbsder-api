import { mock, MockProxy } from 'jest-mock-extended'
import { MockUtils } from '../infrastructure/utils/mock.utils'
import { CreateDecisionUsecase } from './createDecision.usecase'
import { InterfaceDecisionsRepository } from '../domain/decisions.repository.interface'
import { CodeNACsRepository } from '../infrastructure/db/repositories/codeNACs.repository'

describe('createDecisionUsecase', () => {
  const mockDecisionsRepository: MockProxy<InterfaceDecisionsRepository> =
    mock<InterfaceDecisionsRepository>()
  const mockCodeNACsRepository: MockProxy<CodeNACsRepository> = mock<CodeNACsRepository>()
  let mockUtils: MockUtils
  const usecase: CreateDecisionUsecase = new CreateDecisionUsecase(
    mockDecisionsRepository,
    mockCodeNACsRepository
  )

  beforeAll(async () => {
    mockUtils = new MockUtils()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  // now we will fetch from a codeNAC collections in mongo db using the codeNac property from createDecisionDTO

  // it('fetch the codeNAC from the database', async () => {
  //   // GIVEN
  //   const providedCodeNAC = mockUtils.decisionModel.codeNAC
  //   const expectedCodeNAC = mockUtils.codeNacMock

  //   jest
  //     .spyOn(mockCodeNACsRepository, 'getByCodeNac')
  //     .mockImplementationOnce(async () => expectedCodeNAC)

  //   // WHEN
  //   const result = await usecase.execute(providedDecision)

  //   // THEN
  //   expect(result).toEqual(expectedDecision._id.toString())
  // })

  it('creates decision successfully and add occultation based on codeNAC when database is available', async () => {
    // GIVEN
    const expectedDecision = mockUtils.decisionModel
    const providedCodeNAC = mockUtils.codeNacMock
    const providedDecision = { ...expectedDecision, _id: expectedDecision._id.toString() }

    jest
      .spyOn(mockDecisionsRepository, 'create')
      .mockImplementationOnce(async () => expectedDecision._id.toString())

    jest.spyOn(mockCodeNACsRepository, 'getByCodeNac').mockResolvedValue(providedCodeNAC)
    // WHEN
    const result = await usecase.execute(providedDecision)

    // THEN
    expect(result).toEqual(expectedDecision._id.toString())
  })

  it('propagates an Error when repository returns an error', async () => {
    // GIVEN
    const rejectedDecision = mockUtils.createDecisionDTO
    jest.spyOn(mockDecisionsRepository, 'create').mockImplementationOnce(() => {
      throw new Error()
    })
    // WHEN
    await expect(usecase.execute(rejectedDecision))
      // THEN
      .rejects.toThrow(Error)
  })
})
