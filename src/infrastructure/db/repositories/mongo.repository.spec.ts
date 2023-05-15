/**
 * Checklist :
 *
 * - Je veux pouvoir insérer une decision dans la db
 * - Recevoir une erreur si l'insertion ne s'est pas produite
 */

import { MongoMemoryServer } from 'mongodb-memory-server'
import { MockUtils } from '../../utils/mock.utils'
import { MongoRepository } from './mongo.repository'

describe('MongoRepository', () => {
  let mongoServer
  let mongodbServerMemoryUri
  let repository : MongoRepository;
  const mockUtils = new MockUtils()

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongodbServerMemoryUri = mongoServer.getUri()
    repository = new MongoRepository(mongodbServerMemoryUri)
  })

  afterAll(() => {
    repository.disconnect()
    mongoServer.stop()
  })
  
  it('Je veux pouvoir insérer une décision dans la db', async () => {
    // GIVEN
    const decision = mockUtils.createDecisionDTO

    // WHEN
    const result = await repository.create(decision)

    // THEN
    expect(result).toEqual('decision saved in db.')
  })
})
