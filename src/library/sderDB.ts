import { Filter, MongoClient, ObjectId, Sort } from 'mongodb'
import { UnexpectedError } from './error'
import { CodeNac, Decision, UnIdentifiedDecision } from 'dbsder-api-types'
import { MONGO_DB_URL } from './env'

const client = new MongoClient(MONGO_DB_URL)

async function dbConnect() {
  const db = client.db()
  await client.connect()
  return db
}

export async function findCodeNac(filters: Filter<CodeNac>) {
  const db = await dbConnect()
  return db.collection<CodeNac>('codenacs').findOne(filters)
}

export async function findAndReplaceDecision(
  decisionFilters: Filter<UnIdentifiedDecision>,
  decision: UnIdentifiedDecision
): Promise<Decision> {
  const db = await dbConnect()
  const decisionWithId = await db
    .collection<UnIdentifiedDecision>('decisions')
    .findOneAndReplace(decisionFilters, decision, { upsert: true, returnDocument: 'after' })
  if (!decisionWithId)
    throw new UnexpectedError('Upsert behave like there were no document and cannot create')
  return decisionWithId
}

export async function findAndUpdateDecision(
  decisionFilters: Filter<UnIdentifiedDecision>,
  decision: Partial<UnIdentifiedDecision>
): Promise<Decision | null> {
  const db = await dbConnect()
  const decisionWithId = await db
    .collection<UnIdentifiedDecision>('decisions')
    .findOneAndUpdate(decisionFilters, { $set: decision }, { returnDocument: 'after' })
  return decisionWithId
}

export async function findDecision(filters: Filter<Decision>): Promise<Decision | null> {
  const db = await dbConnect()
  return db.collection<Decision>('decisions').findOne(filters)
}

export async function findDecisions(
  filters: Filter<Decision>,
  pageFilters: Filter<Decision> = {},
  sort: Sort = { _id: -1 },
  limit: number = 50
) {
  const db = await dbConnect()
  const length = await db.collection<Decision>('decisions').countDocuments(filters)
  const decisions = await db
    .collection<Decision>('decisions')
    .find({ ...filters, ...pageFilters })
    .sort(sort)
    .limit(limit)
    .toArray()
  return { length, decisions }
}

export type Page = { searchBefore: ObjectId } | { searchAfter: ObjectId } | object
export type PaginatedDecisions = {
  decisions: Decision[]
  previousCursor?: ObjectId
  nextCursor?: ObjectId
  totalDecisions: number
}

export async function findDecisionsWithPagination(
  filters: Filter<Decision>,
  page: Page,
  findDecisionsFunction = findDecisions // used to test
): Promise<PaginatedDecisions> {
  const pageFilters =
    'searchBefore' in page
      ? { _id: { $gte: page.searchBefore } }
      : 'searchAfter' in page
        ? { _id: { $lte: page.searchAfter } }
        : {}

  const { decisions, length } = await findDecisionsFunction(filters, pageFilters)

  const firstDecision = decisions[0]
  const lastDecision = decisions[decisions.length - 1]

  const [decisionBefore] = firstDecision
    ? (await findDecisionsFunction(filters, { _id: { $gt: firstDecision._id } }, { _id: 1 }, 1))
        .decisions
    : []
  const [decisionAfter] = lastDecision
    ? (await findDecisionsFunction(filters, { _id: { $lt: lastDecision._id } }, { _id: -1 }, 1))
        .decisions
    : []

  return {
    decisions,
    totalDecisions: length,
    previousCursor: decisionBefore?._id,
    nextCursor: decisionAfter?._id
  }
}
