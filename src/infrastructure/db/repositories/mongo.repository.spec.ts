import { mock } from 'jest-mock-extended'
import { MockUtils } from '../../utils/mock.utils'
import { ServiceUnavailableException } from '@nestjs/common'
import { IDatabaseRepository } from '../../../domain/database.repository.interface'
import { DecisionModel } from '../models/decision.model'
import { DecisionStatus, Sources } from '../../../domain/enum'

describe('MongoRepository', () => {
  let mockedRepository: IDatabaseRepository
  const mockUtils = new MockUtils()

  beforeAll(async () => {
    mockedRepository = mock<IDatabaseRepository>()
  })

  afterAll(async () => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('I want to be able to insert a decision inside the db', async () => {
      // GIVEN
      const decision = mockUtils.createDecisionDTO
      const expectedDecision: DecisionModel = mockUtils.decisionModel
      jest.spyOn(mockedRepository, 'create').mockResolvedValue(Promise.resolve(expectedDecision))

      // WHEN
      const result = await mockedRepository.create(decision)

      // THEN
      expect(result).toMatchObject(expectedDecision)
    })

    it('I receive an error message when the insertion in the db has failed', () => {
      // GIVEN
      const decision = mockUtils.createDecisionDTO
      jest.spyOn(mockedRepository, 'create').mockImplementationOnce(() => {
        throw new ServiceUnavailableException('Error from database')
      })

      expect(() => {
        // WHEN
        mockedRepository.create(decision)
      })
        // THEN
        .toThrow(new ServiceUnavailableException('Error from database'))
    })
  })

  describe('list', () => {
    it('I receive a list of decisions matching my decision criteria', async () => {
      // GIVEN
      const decisionListDTO = {
        status: DecisionStatus.TOBETREATED,
        source: Sources.TJ,
        startDate: '2023-10-10',
        endDate: '2023-10-11'
      }
      const expectedDecisionsModelList = [mockUtils.decisionModel]
      jest
        .spyOn(mockedRepository, 'list')
        .mockResolvedValue(Promise.resolve(expectedDecisionsModelList))

      const result = await mockedRepository.list(decisionListDTO)

      // THEN
      expect(result).toMatchObject(expectedDecisionsModelList)
    })

    it('I receive an error message when the list recuperation in the db has failed', () => {
      // GIVEN
      const decisionListDTO = {
        status: DecisionStatus.TOBETREATED,
        source: Sources.TJ,
        startDate: '2023-10-10',
        endDate: '2023-10-11'
      }
      jest.spyOn(mockedRepository, 'list').mockImplementationOnce(() => {
        throw new ServiceUnavailableException('Error from database')
      })

      expect(() => {
        // WHEN
        mockedRepository.list(decisionListDTO)
      })
        // THEN
        .toThrow(new ServiceUnavailableException('Error from database'))
    })
  })
})
