import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Model } from 'mongoose'
import { MockUtils } from '../../utils/mock.utils'
import { MongoRepository } from './mongo.repository'
import { DecisionModel } from '../models/decision.model'
import { DatabaseError } from '../../../domain/errors/database.error'

const mockDecisionModel = () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  updateOne: jest.fn()
})

describe('MongoRepository', () => {
  const mockUtils = new MockUtils()
  let mongoRepository: MongoRepository
  let decisionModel: Model<DecisionModel>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoRepository,
        {
          provide: getModelToken(DecisionModel.name),
          useFactory: mockDecisionModel
        }
      ]
    }).compile()

    mongoRepository = module.get<MongoRepository>(MongoRepository)
    decisionModel = module.get<Model<DecisionModel>>(getModelToken(DecisionModel.name))
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('create', () => {
    it('returns created decision when decision is successfully created in DB', async () => {
      // GIVEN
      const decision = mockUtils.createDecisionDTO
      const expectedDecision: DecisionModel = mockUtils.decisionModel
      jest
        .spyOn(decisionModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(expectedDecision as any))

      // WHEN
      const result = await mongoRepository.create(decision)

      // THEN
      expect(result).toMatchObject(expectedDecision)
    })

    it('throws a DatabaseError when the insertion in the DB has failed', async () => {
      // GIVEN
      const decision = mockUtils.createDecisionDTO
      jest.spyOn(decisionModel, 'create').mockRejectedValueOnce(new Error())

      // WHEN
      await expect(mongoRepository.create(decision))
        // THEN
        .rejects.toThrow(DatabaseError)
    })
  })

  describe('list', () => {
    it('returns a list of decisions matching provided decision criteria', async () => {
      // GIVEN
      const decisionListDTO = mockUtils.decisionQueryDTO
      const expectedDecisionsModelList = [mockUtils.decisionModel]
      jest
        .spyOn(decisionModel, 'find')
        .mockImplementationOnce(jest.fn().mockResolvedValueOnce(expectedDecisionsModelList) as any)

      const result = await mongoRepository.list(decisionListDTO)

      // THEN
      expect(result).toMatchObject(expectedDecisionsModelList)
    })

    it('throws a DatabaseError when listing decisions in the DB has failed', async () => {
      // GIVEN
      const decisionListDTO = mockUtils.decisionQueryDTO

      jest.spyOn(decisionModel, 'find').mockRejectedValueOnce(new Error())

      // WHEN
      await expect(mongoRepository.list(decisionListDTO))
        // THEN
        .rejects.toThrow(DatabaseError)
    })
  })

  describe('getDecisionById', () => {
    const id = '1'

    it('return a decision when a valid ID is provided', async () => {
      // GIVEN
      const expectedDecision = mockUtils.decisionModel
      jest.spyOn(decisionModel, 'findOne').mockImplementation(
        () =>
          ({
            lean: jest.fn().mockResolvedValue(expectedDecision)
          }) as any
      )

      // WHEN
      const decision = await mongoRepository.getDecisionById(id)

      // THEN
      expect(decision).toEqual(expectedDecision)
    })

    it('returns null when no decision was found with provided ID', async () => {
      // GIVEN
      const expectedDecision = null
      jest.spyOn(decisionModel, 'findOne').mockImplementation(
        () =>
          ({
            lean: jest.fn().mockResolvedValue(null)
          }) as any
      )

      // WHEN
      const decision = await mongoRepository.getDecisionById(id)

      // THEN
      expect(decision).toEqual(expectedDecision)
    })

    it('throws a DatabaseError when the database is unavailable', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'findOne').mockImplementation(
        () =>
          ({
            lean: jest.fn().mockRejectedValueOnce(new Error())
          }) as any
      )

      // WHEN
      await expect(mongoRepository.getDecisionById(id))
        // THEN
        .rejects.toThrow(DatabaseError)
    })
  })
})
