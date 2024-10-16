import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Model, UpdateWriteOpResult } from 'mongoose'
import { MockUtils } from '../../utils/mock.utils'
import { DecisionsRepository } from './decisions.repository'
import { Decision } from '../models/decision.model'
import {
  DatabaseError,
  DeleteFailedError,
  UpdateFailedError
} from '../../../domain/errors/database.error'
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

const validId = new MockUtils().validId

describe('DecisionsRepository', () => {
  const mockUtils = new MockUtils()
  let decisionsRepository: DecisionsRepository
  let decisionModel: Model<Decision>

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DecisionsRepository,
        {
          provide: getModelToken(Decision.name),
          useFactory: mockDecisionModel
        }
      ]
    }).compile()

    decisionsRepository = module.get<DecisionsRepository>(DecisionsRepository)
    decisionModel = module.get<Model<Decision>>(getModelToken(Decision.name))
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe('create', () => {
    describe('success cases', () => {
      it('returns created decision when decision is successfully created in DB', async () => {
        // GIVEN
        const decision = {
          ...mockUtils.createDecisionDTO,
          importDate: new Date().toISOString(),
          publishDate: null,
          unpublishDate: null
        }

        const expectedDecisionId = validId
        jest.spyOn(decisionModel, 'findOneAndUpdate').mockResolvedValueOnce(mockUtils.decisionModel)

        // WHEN
        const result = await decisionsRepository.create(decision)

        // THEN
        expect(result).toEqual(expectedDecisionId)
      })

      it('returns updated decision when decision is successfully updated in DB', async () => {
        // GIVEN
        const decision = {
          ...mockUtils.createDecisionDTO,
          importDate: new Date().toISOString(),
          publishDate: null,
          unpublishDate: null
        }

        const expectedDecisionId = validId
        jest.spyOn(decisionModel, 'findOneAndUpdate').mockResolvedValueOnce(mockUtils.decisionModel)

        // WHEN
        const result = await decisionsRepository.create(decision)

        // THEN
        expect(result).toEqual(expectedDecisionId)
      })
    })

    describe('error cases', () => {
      it('throws a DatabaseError when the DB is unavailable', async () => {
        // GIVEN
        const decision = {
          ...mockUtils.createDecisionDTO,
          importDate: new Date().toISOString(),
          publishDate: null,
          unpublishDate: null
        }
        jest.spyOn(decisionModel, 'findOneAndUpdate').mockRejectedValueOnce(new Error())

        // WHEN
        await expect(decisionsRepository.create(decision))
          // THEN
          .rejects.toThrow(DatabaseError)
      })
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
      const decision = await decisionsRepository.getById(validId)

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
      const decision = await decisionsRepository.getById(validId)

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
      await expect(decisionsRepository.getById(validId))
        // THEN
        .rejects.toThrow(DatabaseError)
    })
  })

  describe('removeById', () => {
    it('removes a decision when a valid ID is provided', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'deleteOne').mockImplementation(
        () =>
          ({
            lean: jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1 })
          }) as any
      )
      // WHEN
      await expect(decisionsRepository.removeById(validId))
        // THEN
        .resolves.toEqual(undefined)
    })

    it('throws a DecisionNotFoundError when no decision was found for provided ID', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'deleteOne').mockImplementation(
        () =>
          ({
            lean: jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 0 })
          }) as any
      )

      // WHEN
      await expect(decisionsRepository.removeById(validId))
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
      await expect(decisionsRepository.removeById(validId))
        // THEN
        .rejects.toThrow(DatabaseError)
    })

    it('throws a DeleteFailedError if deletion result returns acknowledged to true', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'deleteOne').mockImplementation(
        () =>
          ({
            lean: jest.fn().mockResolvedValue({ acknowledged: false })
          }) as any
      )

      // WHEN
      await expect(decisionsRepository.removeById(validId))
        // THEN
        .rejects.toThrow(DeleteFailedError)
    })
  })

  describe('updateStatut', () => {
    const decisionStatus = 'some-status'

    it('returns updated decision ID when status is successfully updated', async () => {
      // GIVEN
      const mongoSuccessfulResponse: UpdateWriteOpResult = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoSuccessfulResponse)

      // WHEN
      const result = await decisionsRepository.updateStatut(validId, decisionStatus)

      // THEN
      expect(result).toEqual(validId)
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
      const result = await decisionsRepository.updateStatut(validId, decisionStatus)

      // THEN
      expect(result).toEqual(validId)
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
      await expect(decisionsRepository.updateStatut(validId, decisionStatus))
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
      await expect(decisionsRepository.updateStatut(validId, decisionStatus))
        // THEN
        .rejects.toThrow(UpdateFailedError)
    })

    it('throws a DatabaseError when database is unavailable', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'updateOne').mockRejectedValueOnce(new Error())

      // WHEN
      await expect(decisionsRepository.updateStatut(validId, decisionStatus))
        // THEN
        .rejects.toThrow(DatabaseError)
    })
  })

  describe('updateDecisionPseudonymisee', () => {
    const decisionPseudonymizedDecision = 'some pseudonymized decision'

    it('returns updated decision ID when pseudonymized-decision is successfully updated', async () => {
      // GIVEN
      const mongoSuccessfulResponse: UpdateWriteOpResult = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoSuccessfulResponse)

      // WHEN
      const result = await decisionsRepository.updateDecisionPseudonymisee(
        validId,
        decisionPseudonymizedDecision
      )

      // THEN
      expect(result).toEqual(validId)
    })

    it('returns decision ID when decision was found but update failed because it already has the provided pseudonymized-decision', async () => {
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
        validId,
        decisionPseudonymizedDecision
      )

      // THEN
      expect(result).toEqual(validId)
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
        decisionsRepository.updateDecisionPseudonymisee(validId, decisionPseudonymizedDecision)
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
        decisionsRepository.updateDecisionPseudonymisee(validId, decisionPseudonymizedDecision)
      )
        // THEN
        .rejects.toThrow(UpdateFailedError)
    })

    it('throws a DatabaseError when database is unavailable', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'updateOne').mockRejectedValueOnce(new Error())

      // WHEN
      await expect(
        decisionsRepository.updateDecisionPseudonymisee(validId, decisionPseudonymizedDecision)
      )
        // THEN
        .rejects.toThrow(DatabaseError)
    })
  })

  describe('updateRapportsOccultations', () => {
    const decisionConcealmentReports = mockUtils.decisionRapportsOccultations.rapportsOccultations

    it('returns updated decision ID when concealment reports are successfully updated', async () => {
      // GIVEN
      const mongoSuccessfulResponse: UpdateWriteOpResult = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null
      }
      jest.spyOn(decisionModel, 'updateOne').mockResolvedValueOnce(mongoSuccessfulResponse)

      // WHEN
      const result = await decisionsRepository.updateRapportsOccultations(
        validId,
        decisionConcealmentReports
      )

      // THEN
      expect(result).toEqual(validId)
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
        validId,
        decisionConcealmentReports
      )

      // THEN
      expect(result).toEqual(validId)
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
        decisionsRepository.updateRapportsOccultations(validId, decisionConcealmentReports)
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
        decisionsRepository.updateRapportsOccultations(validId, decisionConcealmentReports)
      )
        // THEN
        .rejects.toThrow(UpdateFailedError)
    })

    it('throws a DatabaseError when database is unavailable', async () => {
      // GIVEN
      jest.spyOn(decisionModel, 'updateOne').mockRejectedValueOnce(new Error())

      // WHEN
      await expect(
        decisionsRepository.updateRapportsOccultations(validId, decisionConcealmentReports)
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
        decisionsRepository.mapDecisionSearchParametersToFindCriteria(decisionSearchParams)

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
        decisionsRepository.mapDecisionSearchParametersToFindCriteria(decisionSearchParams)

      // THEN
      expect(findCriterias).toEqual(expectedFindCriterias)
    })
  })
})
