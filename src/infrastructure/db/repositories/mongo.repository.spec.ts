import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Model, UpdateWriteOpResult } from 'mongoose'
import { MockUtils } from '../../utils/mock.utils'
import { MongoRepository } from './mongo.repository'
import { DecisionModel } from '../models/decision.model'
import { DatabaseError, UpdateFailedError } from '../../../domain/errors/database.error'
import { DecisionNotFoundError } from '../../..//domain/errors/decisionNotFound.error'

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

  describe('updateDecisionStatus', () => {
    it('returns updated decision ID when status is successfully updated', async () => {
      // GIVEN
      const decisionId = 'some-id'
      const decisionStatus = 'some-status'

      const mongoSuccessfullResponse: UpdateWriteOpResult = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoSuccessfullResponse)

      // WHEN
      const result = await mongoRepository.updateDecisionStatus(decisionId, decisionStatus)

      // THEN
      expect(result).toEqual(decisionId)
    })

    it('returns decision ID when decision was found but update failed because it already has the provided status', async () => {
      // GIVEN
      const decisionId = 'some-id'
      const decisionStatus = 'some-already-existing-status'

      const mongoResponseWithoutUpdate: UpdateWriteOpResult = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoResponseWithoutUpdate)

      // WHEN
      const result = await mongoRepository.updateDecisionStatus(decisionId, decisionStatus)

      // THEN
      expect(result).toEqual(decisionId)
    })

    it('throws a DecisionNotFoundError when decision is not found', async () => {
      // GIVEN
      const decisionId = 'some-id'
      const decisionStatus = 'some-already-existing-status'

      const mongoResponseNotFound: UpdateWriteOpResult = {
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoResponseNotFound)

      // WHEN
      await expect(mongoRepository.updateDecisionStatus(decisionId, decisionStatus))
        // THEN
        .rejects.toThrow(DecisionNotFoundError)
    })

    it('throws a UpdateFailedError when updating with mongoose fails', async () => {
      // GIVEN
      const decisionId = 'some-id'
      const decisionStatus = 'some-already-existing-status'

      const mongoResponseWithError: UpdateWriteOpResult = {
        acknowledged: false,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoResponseWithError)

      // WHEN
      await expect(mongoRepository.updateDecisionStatus(decisionId, decisionStatus))
        // THEN
        .rejects.toThrow(UpdateFailedError)
    })

    it('throws a DatabaseError when database is unavailable', async () => {
      // GIVEN
      const decisionId = 'some-id'
      const decisionStatus = 'some-status'
      jest.spyOn(decisionModel, 'updateOne').mockRejectedValueOnce(new Error())

      // WHEN
      await expect(mongoRepository.updateDecisionStatus(decisionId, decisionStatus))
        // THEN
        .rejects.toThrow(DatabaseError)
    })
  })
})
