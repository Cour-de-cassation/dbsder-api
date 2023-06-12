import { MongoMemoryServer } from 'mongodb-memory-server'
import * as mongoose from 'mongoose'
import { mongoDbMemoryServerConf } from './mongoDbMemoryServer.conf'

export default async function globalSetup() {
  if (mongoDbMemoryServerConf.Memory) {
    // Config to decided if an mongodb-memory-server instance should be used
    // it's needed in global space, because we don't want to create a new instance every test-suite
    const instance = await MongoMemoryServer.create({
      instance: {
        port: parseInt(mongoDbMemoryServerConf.Port),
        ip: mongoDbMemoryServerConf.IP,
        dbName: mongoDbMemoryServerConf.Database
      }
    })
    const uri = instance.getUri()
    ;(global as any).__MONGOINSTANCE = instance
    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'))
  } else {
    process.env.MONGO_URI = `mongodb://${mongoDbMemoryServerConf.IP}:${mongoDbMemoryServerConf.Port}`
  }

  // The following is to make sure the database is clean before an test starts
  await mongoose.connect(`${process.env.MONGO_URI}/${mongoDbMemoryServerConf.Database}`)
  await mongoose.connection.db.dropDatabase()
  await mongoose.disconnect()
}
