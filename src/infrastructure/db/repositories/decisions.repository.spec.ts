import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Model, UpdateWriteOpResult } from 'mongoose'
import { MockUtils } from '../../utils/mock.utils'
import { DecisionsRepository } from './decisions.repository'
import { DecisionModel } from '../models/decision.model'
import { DatabaseError, UpdateFailedError } from '../../../domain/errors/database.error'
import { DecisionNotFoundError } from '../../../domain/errors/decisionNotFound.error'
import { Sources, LabelStatus } from 'dbsder-api-types'
import { GetDecisionsListDto } from '../../dto/getDecisionsList.dto'

const mockDecisionModel = () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  updateOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn()
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
      jest.spyOn(decisionModel, 'findOneAndUpdate').mockResolvedValueOnce(expectedDecision)

      // WHEN
      const result = await decisionsRepository.create(decision)

      // THEN
      expect(result).toMatchObject(expectedDecision)
    })

    it('throws a DatabaseError when the insertion in the DB has failed', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'findOneAndUpdate').mockRejectedValueOnce(new Error())

      // WHEN
      await expect(decisionsRepository.create(decision))
        // THEN
        .rejects.toThrow(DatabaseError)
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

  describe('removeById', () => {
    const id = '1'

    it('remove a decision when a valid ID is provided', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'deleteOne').mockImplementation(
        () =>
          ({
            lean: jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1 })
          }) as any
      )
      // WHEN
      await expect(decisionsRepository.removeById(id))
        // THEN
        .resolves.toEqual(undefined)
    })

    it('returns null when no decision was found with provided ID', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'deleteOne').mockImplementation(
        () =>
          ({
            lean: jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 0 })
          }) as any
      )

      // WHEN
      await expect(decisionsRepository.removeById(id))
        // THEN
        .rejects.toThrow(DecisionNotFoundError)
    })

    it('throws a DatabaseError when the database is unavailable', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'deleteOne').mockImplementation(
        () =>
          ({
            lean: jest.fn().mockRejectedValueOnce(new Error())
          }) as any
      )

      // WHEN
      await expect(decisionsRepository.removeById(id))
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

  describe('mapDecisionSearchParametersToFindCriterias', () => {
    const todayDate = new Date().toISOString().slice(0, 10)

    it('should map decision search params to findCriterias with correct parameters', () => {
      // GIVEN
      const decisionSearchParams: GetDecisionsListDto = {
        source: Sources.CA,
        status: LabelStatus.TOBETREATED,
        startDate: '2020-01-01',
        number: '123'
      }

      const expectedFindCriterias = {
        sourceName: Sources.CA,
        labelStatus: LabelStatus.TOBETREATED,
        dateCreation: {
          $gte: '2020-01-01',
          $lte: todayDate
        },
        $or: [
          {
            numeroRoleGeneral: '123'
          },
          { appeals: '123' }
        ]
      }

      // WHEN
      const findCriterias =
        decisionsRepository.mapDecisionSearchParametersToFindCriterias(decisionSearchParams)

      // THEN
      expect(findCriterias).toEqual(expectedFindCriterias)
    })

    it('should map decision search params to findCriterias without all parameters', () => {
      // GIVEN
      const decisionSearchParams: GetDecisionsListDto = {
        source: Sources.CA,
        status: LabelStatus.TOBETREATED,
        number: '123'
      }

      const expectedFindCriterias = {
        sourceName: Sources.CA,
        labelStatus: LabelStatus.TOBETREATED,
        $or: [
          {
            numeroRoleGeneral: '123'
          },
          { appeals: '123' }
        ]
      }

      // WHEN
      const findCriterias =
        decisionsRepository.mapDecisionSearchParametersToFindCriterias(decisionSearchParams)

      // THEN
      expect(findCriterias).toEqual(expectedFindCriterias)
    })
  })
})
