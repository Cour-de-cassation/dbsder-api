import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Model, UpdateWriteOpResult } from 'mongoose'
import { MockUtils } from '../../utils/mock.utils'
import { DecisionsRepository } from './decisions.repository'
import { DecisionModel } from '../models/decision.model'
import {
  DatabaseError,
  DuplicateKeyError,
  mongoDuplicateKeyErrorCode,
  UpdateFailedError
} from '../../../domain/errors/database.error'
import { DecisionNotFoundError } from '../../../domain/errors/decisionNotFound.error'

const mockDecisionModel = () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  updateOne: jest.fn()
})

describe('DecisionsRepository', () => {
  const mockUtils = new MockUtils()
  let decisionsRepository: DecisionsRepository
  let decisionModel: Model<DecisionModel>

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DecisionsRepository,
        {
          provide: getModelToken(DecisionModel.name),
          useFactory: mockDecisionModel
        }
      ]
    }).compile()

    decisionsRepository = module.get<DecisionsRepository>(DecisionsRepository)
    decisionModel = module.get<Model<DecisionModel>>(getModelToken(DecisionModel.name))
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('create', () => {
    const decision = mockUtils.createDecisionDTO

    it('returns created decision when decision is successfully created in DB', async () => {
      // GIVEN
      const expectedDecision: DecisionModel = mockUtils.decisionModel
      jest
        .spyOn(decisionModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(expectedDecision as any))

      // WHEN
      const result = await decisionsRepository.create(decision)

      // THEN
      expect(result).toMatchObject(expectedDecision)
    })

    it('throws a DatabaseError when the insertion in the DB has failed', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'create').mockRejectedValueOnce(new Error())

      // WHEN
      await expect(decisionsRepository.create(decision))
        // THEN
        .rejects.toThrow(DatabaseError)
    })
    it('throws a DuplicateKeyError when the insertion in the DB has failed because the _id is already used', async () => {
      // GIVEN
      jest
        .spyOn(decisionModel, 'create')
        .mockRejectedValueOnce({ code: mongoDuplicateKeyErrorCode })

      // WHEN
      await expect(decisionsRepository.create(decision))
        // THEN
        .rejects.toThrow(DuplicateKeyError)
    })
  })

  describe('list', () => {
    const decisionListDTO = mockUtils.decisionQueryDTO

    it('returns a list of decisions matching provided decision criteria', async () => {
      // GIVEN
      const expectedDecisionsModelList = [mockUtils.decisionModel]
      jest
        .spyOn(decisionModel, 'find')
        .mockImplementationOnce(jest.fn().mockResolvedValueOnce(expectedDecisionsModelList) as any)

      const result = await decisionsRepository.list(decisionListDTO)

      // THEN
      expect(result).toMatchObject(expectedDecisionsModelList)
    })

    it('throws a DatabaseError when listing decisions in the DB has failed', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'find').mockRejectedValueOnce(new Error())

      // WHEN
      await expect(decisionsRepository.list(decisionListDTO))
        // THEN
        .rejects.toThrow(DatabaseError)
    })
  })

  describe('getById', () => {
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
      const decision = await decisionsRepository.getById(id)

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
      const decision = await decisionsRepository.getById(id)

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
      await expect(decisionsRepository.getById(id))
        // THEN
        .rejects.toThrow(DatabaseError)
    })
  })

  describe('updateStatut', () => {
    const decisionId = 'some-id'
    const decisionStatus = 'some-status'

    it('returns updated decision ID when status is successfully updated', async () => {
      // GIVEN
      const mongoSuccessfullResponse: UpdateWriteOpResult = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoSuccessfullResponse)

      // WHEN
      const result = await decisionsRepository.updateStatut(decisionId, decisionStatus)

      // THEN
      expect(result).toEqual(decisionId)
    })

    it('returns decision ID when decision was found but update failed because it already has the provided status', async () => {
      // GIVEN
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
      const result = await decisionsRepository.updateStatut(decisionId, decisionStatus)

      // THEN
      expect(result).toEqual(decisionId)
    })

    it('throws a DecisionNotFoundError when decision is not found', async () => {
      // GIVEN
      const mongoResponseNotFound: UpdateWriteOpResult = {
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoResponseNotFound)

      // WHEN
      await expect(decisionsRepository.updateStatut(decisionId, decisionStatus))
        // THEN
        .rejects.toThrow(DecisionNotFoundError)
    })

    it('throws a UpdateFailedError when updating with mongoose fails', async () => {
      // GIVEN
      const mongoResponseWithError: UpdateWriteOpResult = {
        acknowledged: false,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoResponseWithError)

      // WHEN
      await expect(decisionsRepository.updateStatut(decisionId, decisionStatus))
        // THEN
        .rejects.toThrow(UpdateFailedError)
    })

    it('throws a DatabaseError when database is unavailable', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'updateOne').mockRejectedValueOnce(new Error())

      // WHEN
      await expect(decisionsRepository.updateStatut(decisionId, decisionStatus))
        // THEN
        .rejects.toThrow(DatabaseError)
    })
  })

  describe('updateDecisionPseudonymisee', () => {
    const decisionId = 'some-id'
    const decisionPseudonymisedDecision = 'some pseudonymised decision'

    it('returns updated decision ID when pseudonymised-decision is successfully updated', async () => {
      // GIVEN
      const mongoSuccessfullResponse: UpdateWriteOpResult = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoSuccessfullResponse)

      // WHEN
      const result = await decisionsRepository.updateDecisionPseudonymisee(
        decisionId,
        decisionPseudonymisedDecision
      )

      // THEN
      expect(result).toEqual(decisionId)
    })

    it('returns decision ID when decision was found but update failed because it already has the provided pseudonymised-decision', async () => {
      // GIVEN
      const mongoResponseWithoutUpdate: UpdateWriteOpResult = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoResponseWithoutUpdate)

      // WHEN
      const result = await decisionsRepository.updateDecisionPseudonymisee(
        decisionId,
        decisionPseudonymisedDecision
      )

      // THEN
      expect(result).toEqual(decisionId)
    })

    it('throws a DecisionNotFoundError when decision is not found', async () => {
      // GIVEN
      const mongoResponseNotFound: UpdateWriteOpResult = {
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoResponseNotFound)

      // WHEN
      await expect(
        decisionsRepository.updateDecisionPseudonymisee(decisionId, decisionPseudonymisedDecision)
      )
        // THEN
        .rejects.toThrow(DecisionNotFoundError)
    })

    it('throws a UpdateFailedError when updating with mongoose fails', async () => {
      // GIVEN
      const mongoResponseWithError: UpdateWriteOpResult = {
        acknowledged: false,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoResponseWithError)

      // WHEN
      await expect(
        decisionsRepository.updateDecisionPseudonymisee(decisionId, decisionPseudonymisedDecision)
      )
        // THEN
        .rejects.toThrow(UpdateFailedError)
    })

    it('throws a DatabaseError when database is unavailable', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'updateOne').mockRejectedValueOnce(new Error())

      // WHEN
      await expect(
        decisionsRepository.updateDecisionPseudonymisee(decisionId, decisionPseudonymisedDecision)
      )
        // THEN
        .rejects.toThrow(DatabaseError)
    })
  })

  describe('updateRapportsOccultations', () => {
    const decisionId = 'some-id'
    const decisionConcealmentReports = mockUtils.decisionRapportsOccultations.rapportsOccultations

    it('returns updated decision ID when concealment reports are successfully updated', async () => {
      // GIVEN
      const mongoSuccessfullResponse: UpdateWriteOpResult = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoSuccessfullResponse)

      // WHEN
      const result = await decisionsRepository.updateRapportsOccultations(
        decisionId,
        decisionConcealmentReports
      )

      // THEN
      expect(result).toEqual(decisionId)
    })

    it('returns decision ID when decision was found but update failed because it already has the provided concealment reports', async () => {
      // GIVEN
      const mongoResponseWithoutUpdate: UpdateWriteOpResult = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoResponseWithoutUpdate)

      // WHEN
      const result = await decisionsRepository.updateRapportsOccultations(
        decisionId,
        decisionConcealmentReports
      )

      // THEN
      expect(result).toEqual(decisionId)
    })

    it('throws a DecisionNotFoundError when decision is not found', async () => {
      // GIVEN
      const mongoResponseNotFound: UpdateWriteOpResult = {
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoResponseNotFound)

      // WHEN
      await expect(
        decisionsRepository.updateRapportsOccultations(decisionId, decisionConcealmentReports)
      )
        // THEN
        .rejects.toThrow(DecisionNotFoundError)
    })

    it('throws a UpdateFailedError when updating with mongoose fails', async () => {
      // GIVEN
      const mongoResponseWithError: UpdateWriteOpResult = {
        acknowledged: false,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoResponseWithError)

      // WHEN
      await expect(
        decisionsRepository.updateRapportsOccultations(decisionId, decisionConcealmentReports)
      )
        // THEN
        .rejects.toThrow(UpdateFailedError)
    })

    it('throws a DatabaseError when database is unavailable', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'updateOne').mockRejectedValueOnce(new Error())

      // WHEN
      await expect(
        decisionsRepository.updateRapportsOccultations(decisionId, decisionConcealmentReports)
      )
        // THEN
        .rejects.toThrow(DatabaseError)
    })
  })
})
