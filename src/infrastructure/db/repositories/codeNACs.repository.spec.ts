import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Model } from 'mongoose'
import { MockUtils } from '../../utils/mock.utils'
import { CodeNACsRepository } from './codeNACs.repository'
import { CodeNac } from '../models/codeNAC.model'

const mockCodeNacModel = () => ({
  find: jest.fn()
})

describe('CodeNACsRepository', () => {
  const mockUtils = new MockUtils()
  let codeNACsRepository: CodeNACsRepository
  let codeNacModel: Model<CodeNac>

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodeNACsRepository,
        {
          provide: getModelToken(CodeNac.name),
          useFactory: mockCodeNacModel
        }
      ]
    }).compile()

    codeNACsRepository = module.get<CodeNACsRepository>(CodeNACsRepository)
    codeNacModel = module.get<Model<CodeNac>>(getModelToken(CodeNac.name))
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getByCodeNac', () => {
    it('return data from codeNAC table with provided codeNAC', async () => {
      // GIVEN
      const expectedCodeNAC = mockUtils.codeNacMock
      const givenCodeNAC = mockUtils.codeNacMock.codeNAC
      jest.spyOn(codeNacModel, 'findOne').mockImplementation(
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
  })
})
