import { Request, Router } from 'express'
import {
  parseDecisionListFilters,
  parseId,
  parseUnIdentifiedDecisionSupported,
  parseUpdatableDecisionFields,
  UnIdentifiedDecisionSupported,
  UpdatableDecisionFields
} from '../service/decision/models'
import {
  fetchDecisionById,
  fetchDecisions,
  saveDecision,
  updateDecision
} from '../service/decision/handler'
import { ForbiddenError, MissingValue, NotSupported } from '../library/error'
import { Service } from '../service/authentication'
import { Decision } from 'dbsder-api-types'
import queryString from 'qs'

const app = Router()

app.get('/decisions/:id', async (req, res, next) => {
  try {
    const decisionId = parseId(req.params.id)
    const decision = await fetchDecisionById(decisionId)
    res.send(decision)
  } catch (err: unknown) {
    next(err)
  }
})

function parseGetQuery(query: unknown) {
  if (typeof query !== 'object' || !query) throw new NotSupported('querystring', query)
  const filters = parseDecisionListFilters(query)

  if ('searchBefore' in query && 'searchAfter' in query)
    throw new NotSupported(
      'querystring',
      query,
      'searchBefore cannot be combinated with SearchAfter'
    )

  if ('searchBefore' in query) return { filters, searchBefore: parseId(query.searchBefore) }
  if ('searchAfter' in query) return { filters, searchAfter: parseId(query.searchAfter) }
  return { filters }
}

app.get('/decisions', async (req, res, next) => {
  try {
    const { filters, ...pagination } = parseGetQuery(req.query)

    const result = await fetchDecisions(filters, pagination)

    const previousPage = result.previousCursor
      ? queryString.stringify({ ...filters, searchBefore: result.previousCursor.toString() })
      : undefined
    const nextPage = result.nextCursor
      ? queryString.stringify({ ...filters, searchAfter: result.nextCursor.toString() })
      : undefined

    res.send({ ...result, previousPage, nextPage })
  } catch (err: unknown) {
    next(err)
  }
})

function parsePatchBody(
  sourceName: Decision['sourceName'],
  body: Request['body']
): UpdatableDecisionFields {
  if (!body || Object.entries(body).length <= 0)
    throw new MissingValue('req.body', 'body is missing on request')
  const updatableFields = parseUpdatableDecisionFields(sourceName, body)
  if (Object.entries(updatableFields).length <= 0)
    throw new NotSupported('req.body', body, 'Any fields known to update')
  return updatableFields
}

app.patch('/decisions/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id)
    const { sourceName } = await fetchDecisionById(id)
    const updateFields = parsePatchBody(sourceName, req.body)
    const { _id } = await updateDecision(id, sourceName, updateFields)
    res.send({
      _id,
      message: 'Decision mise à jour'
    })
  } catch (err: unknown) {
    next(err)
  }
})

function parsePutBody(body: Request['body']): UnIdentifiedDecisionSupported {
  if (!body || !('decision' in body))
    throw new MissingValue('req.body', "body is missing on request or doesn't contain a decision")
  return parseUnIdentifiedDecisionSupported(body.decision)
}

app.put('/decisions', async (req, res, next) => {
  try {
    if (req.context?.service !== Service.NORMALIZATION) throw new ForbiddenError()

    const decision = parsePutBody(req.body)
    const { _id } = await saveDecision(decision)
    res.send({
      _id,
      message: 'Decision créée ou mise à jour'
    })
  } catch (err: unknown) {
    next(err)
  }
})

export default app
