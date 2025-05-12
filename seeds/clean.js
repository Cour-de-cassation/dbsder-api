const { MongoClient } = require('mongodb')
if (!process.env.NODE_ENV) require('dotenv').config()

async function main() {
  const client = new MongoClient(process.env.MONGO_DB_URL)
  await client.connect()

  const collections = await client.db().collections()

  return Promise.all(collections.map((_) => _.drop()))
}

main()
  .then(console.log)
  .catch(console.error)
  .finally((_) => process.exit())
