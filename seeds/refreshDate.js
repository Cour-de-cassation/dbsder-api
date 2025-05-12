const { MongoClient } = require('mongodb')
if (!process.env.NODE_ENV) require('dotenv').config()

function setDate(dateRef, day, month) {
  const date = new Date(dateRef.toISOString())
  date.setDate(day > 28 ? 28: day)
  date.setMonth(month)
  return date
}

async function refreshDecisions(db, date) {
  const decisions = await db.collection('decisions').find()

  return decisions
    .map(
      ({
        _id,
        dateCreation,
        dateDecision,
        firstImportDate,
        lastImportDate,
        publishDate,
        unpublishDate
      }) =>
        db.collection('decisions').updateOne(
          { _id },
          {
            $set: {
              dateCreation: dateCreation ? date.toISOString() : null,
              dateDecision: setDate(date, (new Date(dateDecision)).getDate(), date.getMonth() - 1).toISOString(),
              firstImportDate: firstImportDate ? date.toISOString() : null,
              lastImportDate: lastImportDate ? date.toISOString() : null,
              publishDate: publishDate ? date.toISOString() : null,
              unpublishDate: unpublishDate ? date.toISOString() : null
            }
          }
        )
    )
    .toArray()
}

async function refreshRawJurica(db, date) {
  const decisions = await db.collection('rawJurica').find()

  return decisions
    .map(({ _id, JDEC_DATE, JDEC_DATE_MAJ, JDEC_DATE_CREATION, DT_ANO, DT_MODIF_ANO }) =>
      db.collection('rawJurica').updateOne(
        { _id },
        {
          $set: {
            JDEC_DATE: setDate(date, new Date(JDEC_DATE).getDate(), date.getMonth() - 1).toISOString().slice(0, 10),
            JDEC_DATE_MAJ: JDEC_DATE_MAJ ? date.toISOString().slice(0, 10) : null,
            JDEC_DATE_CREATION: JDEC_DATE_CREATION
              ? date.toISOString().slice(0, 10).replaceAll('-', '')
              : null,
            DT_ANO: DT_ANO ? date : null,
            DT_MODIF_ANO: DT_MODIF_ANO ? date : null
          }
        }
      )
    )
    .toArray()
}

async function refreshRawJurinet(db, date) {
  const decisions = await db.collection('rawJurinet').find()

  return decisions
    .map(({ _id, DT_DECISION, DT_CREATION, DT_MODIF, DT_ANO, DT_MODIF_ANO }) =>
      db.collection('rawJurinet').updateOne(
        { _id },
        {
          $set: {
            DT_DECISION: setDate(date, new Date(DT_DECISION).getDate(), date.getMonth() - 1),
            DT_CREATION: DT_CREATION ? date : null,
            DT_MODIF: DT_MODIF ? date : null,
            DT_ANO: DT_ANO ? date : null,
            DT_MODIF_ANO: DT_MODIF_ANO ? date : null
          }
        }
      )
    )
    .toArray()
}

async function main() {
  const client = new MongoClient(process.env.MONGO_DB_URL)
  const db = client.db()
  await client.connect()

  const input = process.argv[2]
  const date = new Date(input * 1000)
  if (!(date instanceof Date) || isNaN(date.valueOf()))
    throw new Error(`script.js [date]: waiting for an unix epoch date valid (input: ${input})`)

  const resDecisions = await refreshDecisions(db, date)
  const resJurica = await refreshRawJurica(db, date)
  const resJurinet = await refreshRawJurinet(db, date)

  return Promise.all([...resDecisions, ...resJurica, ...resJurinet])
}

main()
  .then((_) => console.log(`update successfull: ${_.length} documents`))
  .catch(console.error)
  .finally((_) => process.exit())
