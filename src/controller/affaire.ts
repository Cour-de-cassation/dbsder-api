import { Request, Router } from 'express'
import { fetchAffaireByFilters, updateAffaire } from '../service/affaire/handler'
import { responseLog } from './logger'
import { MissingValue, NotSupported, toNotSupported } from '../library/error'
import { Affaire, ParseError, parseId } from 'dbsder-api-types'
import { ObjectId } from 'mongodb'

const app = Router()

function parseGetDecisionPourvoiQuery(query: Request['query']): {
  decisionId?: ObjectId
  numeroPourvoi?: string
} {
  if (typeof query !== 'object' || !query) throw new NotSupported('querystring', query)
  const searchItems: { decisionId?: ObjectId; numeroPourvoi?: string } = {}
  if ('decisionId' in query) {
    searchItems.decisionId = parseId(query.decisionId)
  }
  if ('numeroPourvoi' in query && typeof query.numeroPourvoi === 'string') {
    searchItems.numeroPourvoi = query.numeroPourvoi
  }

  return searchItems
}

app.get(
  '/affaires',
  async (req, res, next) => {
    try {
      const searchItems = parseGetDecisionPourvoiQuery(req.query)
      if (!searchItems)
        throw new MissingValue('searchItems', 'Request needs query with filters to find affaire')
      const affaire: Affaire = await fetchAffaireByFilters(searchItems)
      res.send(affaire)
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

app.patch(
  '/affaires/:id',
  async (req, res, next) => {
    try {
      const _id = req.params.id
      if (!_id) throw new MissingValue('id', 'Request needs a param id to update affaire')
      if (!req.body)
        throw new MissingValue('affaire', 'Request needs a body with partial affaire to update')
      const affaire = req.body
      const updatedAffaire = await updateAffaire({ ...affaire }, _id)
      res.send(updatedAffaire)
      next()
    } catch (error: unknown) {
      if (error instanceof ParseError) throw toNotSupported('affaire', req.body, error)
      else throw error
    }
  },
  responseLog
)

export default app
