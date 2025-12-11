import { Router } from 'express'
import {
  createDocumentAssocieHandler,
  fetchDocumentAssocieByFilters,
  updateDocumentAssocie
} from '../service/documentAssocie/handler'
import { responseLog } from './logger'
import {
  parseDocumentAssocieCreateQuery,
  parseUpdatableDocumentAssocieFields,
  parseId,
  parseDocumentAssocieSearchQuery
} from '../service/documentAssocie/models'

const app = Router()

app.get(
  '/documentassocies',
  async (req, res, next) => {
    try {
      const searchItems = parseDocumentAssocieSearchQuery(req.query)
      const documentAssocies = await fetchDocumentAssocieByFilters(searchItems)
      res.send(documentAssocies)
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

app.post(
  '/documentassocies',
  async (req, res, next) => {
    try {
      const { _id } = await createDocumentAssocieHandler(parseDocumentAssocieCreateQuery(req.body))
      res.send({ _id, message: 'documentAssocié créé' })
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

app.patch(
  '/documentassocies/:id',
  async (req, res, next) => {
    try {
      const id = parseId(req.params.id)
      const updatableFields = parseUpdatableDocumentAssocieFields(req.body)
      const { _id } = await updateDocumentAssocie(id, updatableFields)
      res.send({ _id, message: 'documentAssocié mis a jour' })
      next()
    } catch (err) {
      next(err)
    }
  },
  responseLog
)

export default app
