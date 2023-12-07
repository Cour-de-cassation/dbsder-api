import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Model } from 'mongoose'
import { MockUtils } from '../../utils/mock.utils'
import { CodeNACsRepository } from './codeNACs.repository'
import { CodeNAC } from '../models/codeNAC.model'
import { DatabaseError } from '../../../domain/errors/database.error'

const mockCodeNacModel = () => ({
  find: jest.fn(),
  findOne: jest.fn()
})

describe('CodeNACsRepository', () => {
  const mockUtils = new MockUtils()
  let codeNACsRepository: CodeNACsRepository
  let codeNACModel: Model<CodeNAC>

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodeNACsRepository,
        {
          provide: getModelToken(CodeNAC.name),
          useFactory: mockCodeNacModel
        }
      ]
    }).compile()

    codeNACsRepository = module.get<CodeNACsRepository>(CodeNACsRepository)
    codeNACModel = module.get<Model<CodeNAC>>(getModelToken(CodeNAC.name))
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getByCodeNac', () => {
    it('return data from codeNAC table with provided codeNAC', async () => {
      // GIVEN
      const expectedCodeNAC = mockUtils.codeNacMock
      const givenCodeNAC = mockUtils.codeNacMock.codeNAC
      jest.spyOn(codeNACModel, 'findOne').mockImplementation(
        () =>
          ({
            lean: jest.fn().mockResolvedValue(expectedCodeNAC)
          }) as any
      )

      // WHEN
      const codeNac = await codeNACsRepository.getByCodeNac(givenCodeNAC)

      // THEN
      expect(codeNac).toEqual(expectedCodeNAC)
    })

    it('return error if provided codeNAC is not present in DB', async () => {
      // GIVEN
      const givenCodeNAC = 'notValidGivenCodeNAC'
      jest.spyOn(codeNACModel, 'findOne').mockImplementation(
        () =>
          ({
            lean: jest.fn().mockRejectedValueOnce(new Error())
          }) as any
      )

      // WHEN
      await expect(codeNACsRepository.getByCodeNac(givenCodeNAC))
        // THEN
        .rejects.toThrow(DatabaseError)
    })
  })
})
