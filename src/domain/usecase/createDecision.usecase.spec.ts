/**
 *
 * Checklist :
 *
 * - si on reçoit bien la decision => J'arrive a envoyer ma decision à l'API
 * - on envoie bien la donnée a la DB + si la db arrive bien a enregistré => Je m'assure que la décision s'enregistre en DB
 * - J'ai une erreur de la part de l'API lors d'un dysfonctionnement de la DB
 */

import { MongoMemoryServer } from 'mongodb-memory-server'
import { MockUtils } from '../../infrastructure/utils/mock.utils'
import { CreateDecisionUsecase } from './createDecision.usecase'
import { MongoRepository } from '../../infrastructure/db/repositories/mongo.repository'


describe('createDecisionUsecase', () => {
  let mockUtils : MockUtils
  let usecase : CreateDecisionUsecase
  let mongoServer
  let memoryServerMongooseUri
  let repository : MongoRepository

   beforeAll(async () => {
    mockUtils = new MockUtils()
    usecase = new CreateDecisionUsecase()
    mongoServer = await MongoMemoryServer.create()
    memoryServerMongooseUri = mongoServer.getUri()
    repository = new MongoRepository(memoryServerMongooseUri)
  })

  afterAll(() => {
    repository.disconnect()
    mongoServer.stop()
  })

  it("J'arrive à envoyer ma décision à l'API", async () => {
    // GIVEN
    const decision = mockUtils.createDecisionDTO
  
    jest.spyOn(usecase,"getMongoRepository").mockImplementation(() => repository)
    // WHEN
    const result = await usecase.execute(decision)

    // THEN
    expect(result).toEqual('executed')
  })

  // it("Je m'assure que la décision s'enregistre en DB", () => {
  //       // GIVEN
  //       const decision = mockUtils.createDecisionDTO

  //       // WHEN
  //       const result = usecase.execute(decision)

  //       // THEN
  //       expect(result)
  // })
})
