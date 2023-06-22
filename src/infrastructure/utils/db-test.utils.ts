import * as mongoose from 'mongoose'

export const connectDatabase = async () => {
  await mongoose.connect(process.env.MONGO_DB_URL)
}

export const dropDatabase = async () => {
  if (mongoose) {
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close()
    await mongoose.disconnect()
  }
}

export const dropCollections = async () => {
  if (mongoose) {
    await mongoose.connection.db.dropDatabase()
  }
}
