import { Request, Router } from 'express'
import { ForbiddenError, MissingValue, NotSupported } from '../library/error'
import {
  parseId,
  parseUpdatableDecisionFields,
  UpdatableDecisionFields
} from '../service/decision/models'
import { fetchDecisionById, updateDecisionForLabel } from '../service/decision/handler'
import { Service } from '../service/authentication'
import { Decision } from 'dbsder-api-types'

const app = Router()

function parseBody(
  sourceName: Decision['sourceName'],
  body: Request['body']
): Pick<UpdatableDecisionFields, 'pseudoText' | 'labelTreatments'> {
  if (!body) throw new MissingValue('req.body', 'body is missing on request')
  const updatableDecisionFields = parseUpdatableDecisionFields(sourceName, body)
  if (
    Object.keys(updatableDecisionFields).some((k) => k !== 'pseudoText' && k !== 'labelTreatments')
  )
    throw new NotSupported(
      'body',
      body,
      'Only pseudoText or labelTreatments are allowed on Label Route'
    )
  return updatableDecisionFields
}

/**
 * Logic of this route seems like label responsibility.
 * decision and codenac route should be sufficient to provide Label work
 */
app.patch('/label/:id', async (req, res, next) => {
  try {
    if (req.context?.service !== Service.LABEL) throw new ForbiddenError()

    const id = parseId(req.params.id)
    const decision = await fetchDecisionById(id)
    const updateFields = parseBody(decision.sourceName, req.body)
    const { _id } = await updateDecisionForLabel(decision, updateFields)
    res.send({
      _id,
      message: 'Decision mise à jour'
    })
  } catch (err: unknown) {
    req.log.error(err)
    next(err)
  }
})

export default app
