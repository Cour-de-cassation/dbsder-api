import { MongoMemoryServer } from 'mongodb-memory-server'
import { mongoDbMemoryServerConf } from './mongoDbMemoryServer.conf'

export default async function globalTeardown() {
  if (mongoDbMemoryServerConf.Memory) {
    // Config to decided if an mongodb-memory-server instance should be used
    const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE
    await instance.stop()
  }
}
