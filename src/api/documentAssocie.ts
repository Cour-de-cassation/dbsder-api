import { Router } from 'express'
import {
  createDocumentAssocieHandler,
  fetchDocumentAssocieByFilters,
  updateDocumentAssocie
} from '../services/documentAssocie/handler'
import { responseLog } from './logger'
import {
  parseDocumentAssocieCreateQuery,
  parseUpdatableDocumentAssocieFields,
  parseDocumentAssocieSearchQuery,
  serializeDocumentAssocie
} from '../services/documentAssocie/models'
import { parseModelWithId, serializeModelWithId } from '../utils/serializeId'

const app = Router()

app.get(
  '/documentassocies',
  async (req, res, next) => {
    try {
      const searchItems = parseDocumentAssocieSearchQuery(req.query)
      const documentAssocies = await fetchDocumentAssocieByFilters(searchItems)
      res.send(documentAssocies.map(serializeDocumentAssocie))
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
      res.send(serializeModelWithId({ _id, message: 'documentAssocié créé' }, "_id"))
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
      const { id } = parseModelWithId({ id: req.params.id }, "id")
      const updatableFields = parseUpdatableDocumentAssocieFields(req.body)
      const { _id } = await updateDocumentAssocie(id, updatableFields)
      res.send(serializeModelWithId({ _id, message: 'documentAssocié mis a jour' }, "_id"))
      next()
    } catch (err) {
      next(err)
    }
  },
  responseLog
)

export default app
