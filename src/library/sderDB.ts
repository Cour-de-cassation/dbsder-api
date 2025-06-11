import { Filter, MongoClient } from 'mongodb'
import { unexpectedError } from './error'
import { CodeNac, Decision, UnIdentifiedDecision } from 'dbsder-api-types'
import { MONGO_DB_URL } from './env'

const client = new MongoClient(MONGO_DB_URL)

/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- Type is safe due any fallback into Parameters<T> and ReturnType<T> */
function safeMongoQuery<T extends (...args: any[]) => Promise<any>>(
  mongoQuery: T
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  return async (...params: Parameters<T>) => {
    try {
      const res = await mongoQuery(...params)
      return res
    } catch (err) {
      throw err instanceof Error ? unexpectedError(err) : unexpectedError(new Error())
    }
  }
}

async function dbConnect() {
  const db = client.db()
  await client.connect()
  return db
}

async function _findCodeNac(filters: Filter<CodeNac>) {
  const db = await dbConnect()
  return db.collection<CodeNac>('codenacs').findOne(filters)
}
export const findCodeNac = safeMongoQuery(_findCodeNac)

async function _findAndReplaceDecision(
  decisionFilters: Filter<UnIdentifiedDecision>,
  decision: UnIdentifiedDecision
): Promise<Decision> {
  const db = await dbConnect()
  const decisionWithId = await db
    .collection<UnIdentifiedDecision>('decisions')
    .findOneAndReplace(decisionFilters, decision, { upsert: true, returnDocument: 'after' })
  if (!decisionWithId)
    throw unexpectedError(new Error('Upsert behave like there were no document and cannot create'))
  return decisionWithId
}
export const findAndReplaceDecision = safeMongoQuery(_findAndReplaceDecision)

async function _findAndUpdateDecision(
  decisionFilters: Filter<UnIdentifiedDecision>,
  decision: Partial<UnIdentifiedDecision>
): Promise<Decision | null> {
  const db = await dbConnect()
  const decisionWithId = await db
    .collection<UnIdentifiedDecision>('decisions')
    .findOneAndUpdate(decisionFilters, { $set: decision }, { returnDocument: 'after' })
  return decisionWithId
}
export const findAndUpdateDecision = safeMongoQuery(_findAndUpdateDecision)

async function _findDecision(filters: Filter<Decision>): Promise<Decision | null> {
  const db = await dbConnect()
  return db.collection<Decision>('decisions').findOne(filters)
}
export const findDecision = safeMongoQuery(_findDecision)

async function _findDecisions(filters: Filter<Decision>): Promise<Decision[]> {
  const db = await dbConnect()
  // Todo: check pagination or streaming to avoid a RAM overflow on empty filters
  return db.collection<Decision>('decisions').find(filters).toArray()
}
export const findDecisions = safeMongoQuery(_findDecisions)
