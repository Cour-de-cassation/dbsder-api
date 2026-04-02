import { Router } from 'express'
import {
  createAffaireHandler,
  fetchAffaireByFilters,
  updateAffaire
} from '../services/affaire/handler'
import { responseLog } from './logger'
import {
  Affaire,
  parseAffaireCreateQuery,
  parseAffaireSearchQuery,
  parseAffaireUpdateQuery,
  serializeAffaire
} from '../services/affaire/models'
import { parseModelWithId } from '../utils/serializeId'

const app = Router()

app.get(
  '/affaires',
  async (req, res, next) => {
    try {
      const searchItems = parseAffaireSearchQuery(req.query)
      const affaire: Affaire = await fetchAffaireByFilters(searchItems)
      res.send(serializeAffaire(affaire))
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

app.post(
  '/affaires',
  async (req, res, next) => {
    try {
      const affaire: Affaire | null = await createAffaireHandler(parseAffaireCreateQuery(req.body))
      res.send(serializeAffaire(affaire))
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
      const { id } = parseModelWithId({ id: req.params.id }, 'id')
      const affaireUpdateQuery = parseAffaireUpdateQuery(req.body)
      const updatedAffaire = await updateAffaire(id, affaireUpdateQuery)
      res.send(serializeAffaire(updatedAffaire))
      next()
    } catch (err) {
      next(err)
    }
  },
  responseLog
)

export default app
