import { mock } from 'jest-mock-extended'
import { MockUtils } from '../../utils/mock.utils'
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { IDatabaseRepository } from '../database.repository.interface'
import { DecisionModel } from '../models/decision.model'

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
    it('I receive an id and message that confirms a decision is inserted in the db', async () => {
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
      const decisionListDTO = mockUtils.decisionQueryDTO
      const expectedDecisionsModelList = [mockUtils.decisionModel]
      jest
        .spyOn(mockedRepository, 'list')
        .mockResolvedValue(Promise.resolve(expectedDecisionsModelList))

      const result = await mockedRepository.list(decisionListDTO)

      // THEN
      expect(result).toMatchObject(expectedDecisionsModelList)
    })

    it('I receive an error message when the list recuperation in the db has failed', async () => {
      // GIVEN
      const decisionListDTO = mockUtils.decisionQueryDTO

      jest
        .spyOn(mockedRepository, 'list')
        .mockRejectedValueOnce(new ServiceUnavailableException('Error from database'))

      // WHEN
      await expect(mockedRepository.list(decisionListDTO))
        .rejects // THEN
        .toThrow(new ServiceUnavailableException('Error from database'))
    })
  })

  describe('getDecisionById', () => {
    it('throws an error if the database is unavailable', () => {
      // GIVEN
      const id = '1'
      jest
        .spyOn(mockedRepository, 'getDecisionById')
        .mockRejectedValueOnce(new ServiceUnavailableException('Error from database'))

      // WHEN
      expect(() => mockedRepository.getDecisionById(id))
        .rejects //THEN
        .toThrow(new ServiceUnavailableException('Error from database'))
    })

    it('throws an error if the decision does not exist', () => {
      // GIVEN
      const id = '1'
      jest.spyOn(mockedRepository, 'getDecisionById').mockRejectedValueOnce(new NotFoundException())

      // WHEN
      expect(() => mockedRepository.getDecisionById(id))
        .rejects //THEN
        .toThrow(new NotFoundException())
    })

    it('return a decision with a valid id provided', async () => {
      // GIVEN
      const id = '1'
      const expectedDecision = mockUtils.decisionModel
      jest.spyOn(mockedRepository, 'getDecisionById').mockResolvedValueOnce(mockUtils.decisionModel)

      // WHEN
      const decision = await mockedRepository.getDecisionById(id)

      // THEN
      expect(decision).toEqual(expectedDecision)
    })
  })
})
