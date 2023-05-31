import { mock } from 'jest-mock-extended'
import { MockUtils } from '../../utils/mock.utils'
import { ServiceUnavailableException } from '@nestjs/common'
import { IDatabaseRepository } from './database.repository.interface'
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

  it('Je veux pouvoir insérer une décision dans la db', async () => {
    // GIVEN
    const decision = mockUtils.createDecisionDTO
    const expectedDecision: DecisionModel = mockUtils.decisionModel
    jest.spyOn(mockedRepository, 'create').mockResolvedValue(Promise.resolve(expectedDecision))

    // WHEN
    const result = await mockedRepository.create(decision)

    // THEN
    expect(result).toMatchObject(expectedDecision)
  })

  it("Je reçois un message d'erreur si l'insertion en db a échoué", () => {
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
