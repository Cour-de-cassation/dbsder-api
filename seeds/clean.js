const { MongoClient } = require('mongoose/node_modules/mongodb')
if (!process.env.NODE_ENV) require('dotenv')

async function main() {
  const client = new MongoClient(process.env.MONGO_DB_URL, { useUnifiedTopology: true })
  await client.connect()

  const collections = await client.db(process.env.MONGO_DATABASE).collections()

  return Promise.all(collections.map((_) => _.drop()))
}

main()
  .then(console.log)
  .catch(console.error)
  .finally((_) => process.exit())
