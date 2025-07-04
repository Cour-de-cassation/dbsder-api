const { MongoClient, BSON } = require('mongodb')
const { writeFile } = require('fs/promises')
const { existsSync, mkdirSync } = require('fs')
const { resolve } = require('path')
if (!process.env.NODE_ENV) require('dotenv').config()

async function exportCollection(collection) {
  const { collectionName } = collection
  const raw = await collection.find().toArray()
  const dirPath = resolve(__dirname, 'db')

  if (!existsSync(dirPath)) mkdirSync(dirPath)

  return writeFile(resolve(dirPath, `${collectionName}.json`), BSON.EJSON.stringify(raw, null, 2), 'utf8')
}

async function main() {
  const client = new MongoClient(process.env.MONGO_DB_URL)
  await client.connect()

  const dbCollections = await client.db().collections()
  const collections = dbCollections.flat()

  return Promise.all(collections.map(exportCollection))
}

main()
  .catch(console.error)
  .finally((_) => process.exit())
