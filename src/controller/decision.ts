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
import { ForbiddenError, MissingValue } from '../library/error'
import { Service } from '../service/authentication'
import { Decision } from 'dbsder-api-types'

const app = Router()

app.get('/decisions/:id', async (req, res, next) => {
  try {
    const decisionId = parseId(req.params.id)
    const decision = await fetchDecisionById(decisionId)
    res.send(decision)
  } catch (err: unknown) {
    req.log.error(err)
    next(err)
  }
})

app.get('/decisions', async (req, res, next) => {
  try {
    const filters = parseDecisionListFilters(req.query)
    const decision = await fetchDecisions(filters)
    res.send(decision)
  } catch (err: unknown) {
    req.log.error(err)
    next(err)
  }
})

function parsePatchBody(
  sourceName: Decision['sourceName'],
  body: Request['body']
): UpdatableDecisionFields {
  if (!body) throw new MissingValue('req.body', 'body is missing on request')
  return parseUpdatableDecisionFields(sourceName, body)
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
    req.log.error(err)
    next(err)
  }
})

function parsePutBody(body: Request['body']): UnIdentifiedDecisionSupported {
  if (!body || !('decision' in body))
    throw new MissingValue(
      'req.body',
      "body is missing on request or doesn't contain a decision"
    )
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
    req.log.error(err)
    next(err)
  }
})

export default app
