// Following https://nodkz.github.io/mongodb-memory-server/docs/guides/integration-examples/test-runners
import * as mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { mongoDbMemoryServerConf } from './mongoDbMemoryServer.conf'

export default async function globalSetup() {
  if (mongoDbMemoryServerConf.Memory) {
    // To reuse database in test suite
    const instance = await MongoMemoryServer.create({
      instance: {
        port: parseInt(mongoDbMemoryServerConf.Port),
        ip: mongoDbMemoryServerConf.IP,
        dbName: mongoDbMemoryServerConf.Database
      }
    })
    const uri = instance.getUri()
    global.__MONGOINSTANCE = instance
    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'))
  } else {
    process.env.MONGO_URI = `mongodb://${mongoDbMemoryServerConf.IP}:${mongoDbMemoryServerConf.Port}`
  }

  // Cleaning before test starts
  await mongoose.connect(`${process.env.MONGO_URI}/${mongoDbMemoryServerConf.Database}`)
  await mongoose.connection.db.dropDatabase()
  await mongoose.disconnect()
}
