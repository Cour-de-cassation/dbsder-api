import { Router } from 'express'
import { fetchAffaireByFilters, saveAffaire, updateAffaire } from '../service/affaire/handler'
import { responseLog } from './logger'
import { MissingValue, NotSupported, toNotSupported } from '../library/error'
import { affaireSearchType, buildAffaireFilter } from '../service/affaire/models'
import { Affaire, isValidAffaire, ParseError } from 'dbsder-api-types'
import { Filter } from 'mongodb'

const app = Router()

app.post(
  '/affaires',
  async (req, res, next) => {
    try {
      if (!req.body) throw new MissingValue('req.body', 'Request needs a body with affaire to save')
      const affaire = isValidAffaire(req.body)
      const savedAffaire = await saveAffaire(affaire)
      res.send(savedAffaire)
      next()
    } catch (err: unknown) {
      if (err instanceof ParseError) throw toNotSupported('affaire', req.body, err)
      next(err)
    }
  },
  responseLog
)

function parseGetQuery(query: unknown): {
  mongoFilter: Filter<Affaire>
  filters: affaireSearchType
} {
  if (typeof query !== 'object' || !query) throw new NotSupported('querystring', query)
  const { mongoFilter, filters } = buildAffaireFilter(query)
  return { mongoFilter, filters }
}

app.get(
  '/affaires',
  async (req, res, next) => {
    try {
      const { filters, mongoFilter } = parseGetQuery(req.query)
      if (!mongoFilter)
        throw new MissingValue('filters', 'Request needs query with filters to find affaire')
      const affaire = await fetchAffaireByFilters(mongoFilter, filters)
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
