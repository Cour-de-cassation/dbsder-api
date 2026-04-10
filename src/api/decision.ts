import { Request, Router } from 'express'
import {
  parseDecisionListFilters,
  parseUnIdentifiedDecisionSupported,
  parseUpdatableDecisionFields,
  serializeDecision,
  UnIdentifiedDecisionSupported,
  UpdatableDecisionFields
} from '../services/decision/models'
import {
  fetchDecisionById,
  fetchDecisions,
  saveDecision,
  updateDecision,
  deleteDecisionById
} from '../services/decision/handler'
import { ForbiddenError, MissingValue, NotSupported } from '../services/error'
import { Service } from '../services/authentication'
import { Decision } from '@dbsder-api-types'
import queryString from 'qs'
import { responseLog } from './logger'
import { parseModelWithId, serializeModelWithId } from '../utils/serializeId'

const app = Router()

app.get(
  '/decisions/:id',
  async (req, res, next) => {
    try {
      const { decisionId } = parseModelWithId({ decisionId: req.params.id }, 'decisionId')
      const decision = await fetchDecisionById(decisionId)
      res.send(serializeDecision(decision))
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

function parseGetQuery(query: unknown) {
  if (typeof query !== 'object' || !query) throw new NotSupported('querystring', query)
  const filters = parseDecisionListFilters(query)

  if ('searchBefore' in query && 'searchAfter' in query)
    throw new NotSupported(
      'querystring',
      query,
      'searchBefore cannot be combinated with SearchAfter'
    )

  if ('searchBefore' in query && typeof query.searchBefore === 'string') {
    const { searchBefore } = parseModelWithId({ searchBefore: query.searchBefore }, 'searchBefore')
    return { filters, searchBefore }
  }

  if ('searchAfter' in query && typeof query.searchAfter === 'string') {
    const { searchAfter } = parseModelWithId({ searchAfter: query.searchAfter }, 'searchAfter')
    return { filters, searchAfter }
  }

  return { filters }
}

app.get(
  '/decisions',
  async (req, res, next) => {
    try {
      const { filters, ...pagination } = parseGetQuery(req.query)

      const result = await fetchDecisions(filters, pagination)

      const decisions = result.decisions.map(serializeDecision)
      const previousPage = result.previousCursor
        ? queryString.stringify({ ...filters, searchBefore: result.previousCursor.toString() })
        : undefined
      const nextPage = result.nextCursor
        ? queryString.stringify({ ...filters, searchAfter: result.nextCursor.toString() })
        : undefined

      res.send({ ...result, decisions, previousPage, nextPage })
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

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

app.patch(
  '/decisions/:id',
  async (req, res, next) => {
    try {
      const { id } = parseModelWithId({ id: req.params.id }, 'id')
      const { sourceName } = await fetchDecisionById(id)
      const updateFields = parsePatchBody(sourceName, req.body)
      const { _id } = await updateDecision(id, sourceName, updateFields)
      res.send(
        serializeModelWithId(
          {
            _id,
            message: 'Decision mise à jour'
          },
          '_id'
        )
      )
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

function parsePutBody(body: Request['body']): UnIdentifiedDecisionSupported {
  if (!body || !('decision' in body))
    throw new MissingValue('req.body', "body is missing on request or doesn't contain a decision")
  return parseUnIdentifiedDecisionSupported(body.decision)
}

app.put(
  '/decisions',
  async (req, res, next) => {
    try {
      if (req.context?.service !== Service.NORMALIZATION) throw new ForbiddenError()

      const decision = parsePutBody(req.body)
      const { _id } = await saveDecision(decision)
      res.send(
        serializeModelWithId(
          {
            _id,
            message: 'Decision créée ou mise à jour'
          },
          '_id'
        )
      )
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

app.delete(
  '/decisions/:id',
  async (req, res, next) => {
    try {
      const { decisionId } = parseModelWithId({ decisionId: req.params.id }, 'decisionId')
      const deleted = await deleteDecisionById(decisionId)
      res.send({
        message: deleted ? 'Decision supprimée' : 'Decision non supprimée'
      })
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

export default app
