import { Router } from 'express'
import { fetchAffaireByFilters, updateAffaire } from '../service/affaire/handler'
import { responseLog } from './logger'
import { Affaire } from 'dbsder-api-types'
import { parseAffaireSearchQuery, parseAffaireUpdateQuery, parseId } from '../service/affaire/models'

const app = Router()

app.get(
  '/affaires',
  async (req, res, next) => {
    try {
      const searchItems = parseAffaireSearchQuery(req.query)
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
    const id = parseId(req.params.id)
    const affaireUpdateQuery = parseAffaireUpdateQuery(req.body)
    const updatedAffaire = await updateAffaire(id, affaireUpdateQuery)
      res.send(updatedAffaire)
      next()
  },
  responseLog
)

export default app
