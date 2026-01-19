import { DeleteResult, Filter, MongoClient, ObjectId, Sort, WithoutId } from 'mongodb'
import { NotFound, UnexpectedError } from './error'
import { MONGO_DB_URL } from './env'
import { Affaire, CodeNac, Decision, DocumentAssocie, UnIdentifiedDecision } from 'dbsder-api-types'

const client = new MongoClient(MONGO_DB_URL, { directConnection: true })

async function dbConnect() {
  const db = client.db()
  await client.connect()
  return db
}

export async function findCodeNac(filters: Filter<CodeNac>) {
  const db = await dbConnect()
  return db.collection<CodeNac>('codenacs').findOne(filters)
}

export async function findAllCodeNac() {
  const db = await dbConnect()
  return db.collection<CodeNac>('codenacs').find().toArray()
}

export async function createNac(codeNac: WithoutId<CodeNac>): Promise<CodeNac> {
  const db = await dbConnect()
  const codeNacWithId = await db.collection<WithoutId<CodeNac>>('codenacs').insertOne(codeNac)
  if (!codeNacWithId.acknowledged || !codeNacWithId.insertedId) {
    throw new UnexpectedError('Insert behave like there were no document and cannot create')
  }
  return { ...codeNac, _id: codeNacWithId.insertedId }
}

export async function updateNacById(
  _id: ObjectId,
  updateFields: Partial<CodeNac>
): Promise<CodeNac> {
  const db = await dbConnect()
  const codeNacWithId = await db
    .collection<CodeNac>('codenacs')
    .findOneAndUpdate({ _id }, { $set: updateFields }, { returnDocument: 'after' })
  if (!codeNacWithId)
    throw new UnexpectedError('The update behave like there were no document and cannot update')
  return codeNacWithId
}
//####################################################################
// codenac suite 
//####################################################################

export async function findAllValidCodeNac(): Promise<CodeNac[]> {
  const db = await dbConnect()

  return db.collection<CodeNac>('codenacs')
    .find({
      obsolete: false,
      $or: [
        { dateFinValidite: null },
      ]
    })
    .toArray()
}


export async function findValidCodeNac(codeNac: CodeNac['codeNAC']): Promise<CodeNac | null> {
  const db = await dbConnect()
  const codenac = db.collection<CodeNac>('codenacs')
    .findOne({
      codeNAC: codeNac,
      obsolete: false,
      $or: [
        { dateFinValidite: null },
      ]
    })

  return codenac
}

//####################################################################
// codenac end
//####################################################################

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

export async function deleteDecision(filters: Filter<Decision>): Promise<DeleteResult> {
  const db = await dbConnect()
  return db.collection<Decision>('decisions').deleteOne(filters)
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

export async function createAffaire(affaire: WithoutId<Affaire>): Promise<Affaire> {
  const db = await dbConnect()
  const affaireWithId = await db.collection<WithoutId<Affaire>>('affaires').insertOne(affaire)
  if (!affaireWithId.acknowledged || !affaireWithId.insertedId) {
    throw new UnexpectedError('Insert behave like there were no document and cannot create')
  }
  return { ...affaire, _id: affaireWithId.insertedId }
}

export async function updateAffaireById(
  _id: ObjectId,
  updateFields: Partial<Affaire>
): Promise<Affaire> {
  const db = await dbConnect()
  const affaireWithId = await db
    .collection<Affaire>('affaires')
    .findOneAndUpdate({ _id }, { $set: updateFields }, { returnDocument: 'after' })
  if (!affaireWithId)
    throw new UnexpectedError('The update behave like there were no document and cannot update')
  return affaireWithId
}

export async function findAffaire(filter: Filter<Affaire>): Promise<Affaire[] | null> {
  const db = await dbConnect()
  return db.collection<Affaire>('affaires').find(filter).toArray()
}

export async function createDocumentAssocie(
  documentAssocie: WithoutId<DocumentAssocie>
): Promise<DocumentAssocie> {
  const db = await dbConnect()
  const documentAssocieWithId = await db
    .collection<WithoutId<DocumentAssocie>>('documentassocies')
    .insertOne(documentAssocie)
  if (!documentAssocieWithId.acknowledged || !documentAssocieWithId.insertedId) {
    throw new UnexpectedError('Insert behave like there were no documentAssocie created')
  }
  return { ...documentAssocie, _id: documentAssocieWithId.insertedId }
}

export async function updateDocumentAssocieById(
  _id: ObjectId,
  updateFields: Partial<DocumentAssocie>
): Promise<DocumentAssocie> {
  const db = await dbConnect()
  const documentAssocieWithId = await db
    .collection<DocumentAssocie>('documentassocies')
    .findOneAndUpdate({ _id }, { $set: updateFields }, { returnDocument: 'after' })
  if (!documentAssocieWithId)
    throw new UnexpectedError(
      'The update behave like there were no documentAssocie and cannot update'
    )
  return documentAssocieWithId
}

export async function findDocumentAssocie(
  filter: Filter<DocumentAssocie>
): Promise<DocumentAssocie[] | null> {
  const db = await dbConnect()
  return db.collection<DocumentAssocie>('documentassocies').find(filter).toArray()
}
