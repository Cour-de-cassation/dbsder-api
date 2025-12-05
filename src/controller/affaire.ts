import { Router } from 'express'
import {
  createAffaireHandler,
  fetchAffaireByFilters,
  updateAffaire
} from '../service/affaire/handler'
import { responseLog } from './logger'
import { Affaire } from 'dbsder-api-types'
import {
  parseAffaireCreateQuery,
  parseAffaireSearchQuery,
  parseAffaireUpdateQuery,
  parseId
} from '../service/affaire/models'

const app = Router()

app.get(
  '/affaires',
  async (req, res, next) => {
    try {
      const searchItems = parseAffaireSearchQuery(req.query)
      const affaire: Affaire | null = await fetchAffaireByFilters(searchItems)
      res.send(affaire)
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
      res.send(affaire)
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
      const id = parseId(req.params.id)
      const affaireUpdateQuery = parseAffaireUpdateQuery(req.body)
      const updatedAffaire = await updateAffaire(id, affaireUpdateQuery)
      res.send(updatedAffaire)
      next()
    } catch (err) {
      next(err)
    }
  },
  responseLog
)

export default app
