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
import { forbiddenError, missingValue } from '../library/error'
import { Service } from '../service/authentication'

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

function parsePatchBody(body: Request['body']): UpdatableDecisionFields {
  if (!body) throw missingValue('req.body', new Error('body is missing on request'))
  const maybeBody = JSON.parse(body)
  return parseUpdatableDecisionFields(maybeBody)
}

app.patch('/decisions/:id', async (req, res, next) => {
  try {
    if (req.context?.service !== Service.LABEL) throw forbiddenError(new Error())

    const id = parseId(req.params.id)
    const updateFields = parsePatchBody(req.body)
    const { _id } = await updateDecision(id, updateFields)
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
  if (!body) throw missingValue('req.body', new Error('body is missing on request'))
  const maybeBody = JSON.parse(body)
  return parseUnIdentifiedDecisionSupported(maybeBody)
}

app.put('/decisions', async (req, res, next) => {
  try {
    if (req.context?.service !== Service.NORMALIZATION) throw forbiddenError(new Error())

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
