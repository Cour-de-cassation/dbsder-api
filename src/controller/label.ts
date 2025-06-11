import { Request, Router } from 'express'
import { forbiddenError, missingValue } from '../library/error'
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
  sourceName: Decision["sourceName"],
  body: Request['body']
): Omit<UpdatableDecisionFields, 'labelStatus' | 'publishStatus'> {
  if (!body) throw missingValue('req.body', new Error('body is missing on request'))
  return parseUpdatableDecisionFields(sourceName, body)
}

/**
 * Logic of this route seems like label responsibility.
 * decision and codenac route should be sufficient to provide Label work
 */
app.patch('/label/:id', async (req, res, next) => {
  try {
    if (req.context?.service !== Service.LABEL) throw forbiddenError(new Error())

    const id = parseId(req.params.id)
    const { sourceName } = await fetchDecisionById(id)
    const updateFields = parseBody(sourceName, req.body)
    const { _id } = await updateDecisionForLabel(id, sourceName, updateFields)
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
