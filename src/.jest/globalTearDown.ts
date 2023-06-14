// Following https://nodkz.github.io/mongodb-memory-server/docs/guides/integration-examples/test-runners
import { MongoMemoryServer } from 'mongodb-memory-server'
import { mongoDbMemoryServerConf } from './mongoDbMemoryServer.conf'

export default async function globalTeardown() {
  if (mongoDbMemoryServerConf.Memory) {
    const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE
    await instance.stop()
  }
}
