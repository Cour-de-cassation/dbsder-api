import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Model } from 'mongoose'
import { MockUtils } from '../../utils/mock.utils'
import { CodeDecisionRepository } from './codeDecision.repository'
import { CodeDecision } from '../models/codeDecision.model'
import { DatabaseError } from '../../../domain/errors/database.error'

const mockCodeDecisionModel = () => ({
  find: jest.fn(),
  findOne: jest.fn()
})

describe('CodeDecisionRepository', () => {
  const mockUtils = new MockUtils()
  let codeDecisionRepository: CodeDecisionRepository
  let codeDecisionModel: Model<CodeDecision>

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodeDecisionRepository,
        {
          provide: getModelToken(CodeDecision.name),
          useFactory: mockCodeDecisionModel
        }
      ]
    }).compile()

    codeDecisionRepository = module.get<CodeDecisionRepository>(CodeDecisionRepository)
    codeDecisionModel = module.get<Model<CodeDecision>>(getModelToken(CodeDecision.name))
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getByCodeDecision', () => {
    it('return data from codeDecision table with provided codeDecision', async () => {
      // GIVEN
      const expectedCodeDecision = mockUtils.codeDecisionMock
      const givenCodeDecision = mockUtils.codeDecisionMock.codeDecision
      jest.spyOn(codeDecisionModel, 'findOne').mockImplementation(
        () =>
          ({
            lean: jest.fn().mockResolvedValue(expectedCodeDecision)
          }) as any
      )

      // WHEN
      const codeDecision = await codeDecisionRepository.getByCodeDecision(givenCodeDecision)

      // THEN
      expect(codeDecision).toEqual(expectedCodeDecision)
    })

    it('return null when codeDecision is not found', async () => {
      // GIVEN
      const givenCodeDecision = 'XXO'
      jest.spyOn(codeDecisionModel, 'findOne').mockImplementation(
        () =>
          ({
            lean: jest.fn().mockResolvedValue(null)
          }) as any
      )

      // WHEN
      const codeDecision = await codeDecisionRepository.getByCodeDecision(givenCodeDecision)

      // THEN
      expect(codeDecision).toEqual(null)
    })

    it('return error if provided codeDecision is not present in DB', async () => {
      // GIVEN
      const givenCodeDecision = 'notValidGivenCodeDecision'
      jest.spyOn(codeDecisionModel, 'findOne').mockImplementation(
        () =>
          ({
            lean: jest.fn().mockRejectedValueOnce(new Error())
          }) as any
      )

      // WHEN
      await expect(codeDecisionRepository.getByCodeDecision(givenCodeDecision))
        // THEN
        .rejects.toThrow(DatabaseError)
    })
  })
})
