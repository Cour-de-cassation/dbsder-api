import { Request, Router } from 'express'
import { forbiddenError, missingValue } from '../library/error'
import {
  parseId,
  parseUpdatableDecisionFields,
  UpdatableDecisionFields
} from '../service/decision/models'
import { updateDecisionForLabel } from '../service/decision/handler'
import { Service } from '../service/authentication'

const app = Router()

function parseBody(
  body: Request['body']
): Omit<UpdatableDecisionFields, 'labelStatus' | 'publishStatus'> {
  if (!body) throw missingValue('req.body', new Error('body is missing on request'))
  const maybeDecisionFields = JSON.parse(body)
  return parseUpdatableDecisionFields(maybeDecisionFields)
}

/**
 * Logic of this route seems like label responsability.
 * decision and codenac route should be sufficient to provide Label work
 */
app.patch('/fromLabel/:id', async (req, res, next) => {
  try {
    if (req.context?.service !== Service.LABEL) throw forbiddenError(new Error())
    
    const id = parseId(req.params.id)
    const updateFields = parseBody(req.body)
    const { _id } = await updateDecisionForLabel(id, updateFields)
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
