import { MongoMemoryServer } from 'mongodb-memory-server'
import { MockUtils } from '../../infrastructure/utils/mock.utils'
import { CreateDecisionUsecase } from './createDecision.usecase'
import { MongoRepository } from '../../infrastructure/db/repositories/mongo.repository'
import { ServiceUnavailableException } from '@nestjs/common'
import mongoose from 'mongoose'

describe('createDecisionUsecase', () => {
  let mockUtils: MockUtils
  let usecase: CreateDecisionUsecase
  let mongoServer
  let memoryServerMongooseUri
  let repository: MongoRepository

  beforeAll(async () => {
    mockUtils = new MockUtils()
    usecase = new CreateDecisionUsecase()
    mongoServer = await MongoMemoryServer.create()
    memoryServerMongooseUri = mongoServer.getUri()
    repository = new MongoRepository(memoryServerMongooseUri)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    mongoServer.stop()
  })

  it("J'arrive à envoyer ma décision à l'API", async () => {
    // GIVEN
    const decision = mockUtils.createDecisionDTO

    jest.spyOn(usecase, 'getMongoRepository').mockImplementationOnce(() => repository)
    // WHEN
    const result = await usecase.execute(decision)

    // THEN
    expect(result).toEqual('executed')
  })

  it("Je m'assure que la décision s'enregistre en DB", async () => {
    // GIVEN
    const decision = mockUtils.createDecisionDTO
    jest.spyOn(usecase, 'getMongoRepository').mockImplementationOnce(() => repository)

    const repositoryCreateFunction = jest.spyOn(repository, 'create')

    // WHEN
    await usecase.execute(decision)

    // THEN
    expect(repositoryCreateFunction).toHaveBeenCalledWith(decision)
  })

  it("Je reçois une erreur lors d'un dysfonctionnement de la DB", async () => {
    // GIVEN
    const decision = mockUtils.createDecisionDTO
    jest.spyOn(repository, 'create').mockImplementationOnce(() => {
      throw new ServiceUnavailableException('Error from repository')
    })

    await expect(usecase.execute(decision)).rejects.toThrow(
      new ServiceUnavailableException('Error from repository')
    )
  })
})
