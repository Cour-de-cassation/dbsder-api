import { mock } from 'jest-mock-extended'
import { MockUtils } from '../../utils/mock.utils'
import { ServiceUnavailableException } from '@nestjs/common'
import { IDatabaseRepository } from '../../../domain/database.repository.interface'
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
