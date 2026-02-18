import { Router } from 'express'
import {
  createCodeNac,
  deleteCodeNac,
  fetchCodeNacByNac,
  fetchEveryCodeNacByNac,
  fetchEverySubChapter,
  fetchEveryValidCodeNac,
  updateNacIfExistsOrCreate
} from '../service/codeNac/handler'
import { responseLog } from './logger'
import { MissingValue } from '../library/error'
import { CodeNac, parsePartialCodeNac } from 'dbsder-api-types'
import { WithoutId } from 'mongodb'
import { parseFilterNAC } from '../library/codenacs'

const app = Router()

app.get(
  '/codenacs',
  async (req, res, next) => {
    try {
      const allValidCodeNacs = await fetchEveryValidCodeNac(parseFilterNAC(req.query.filters))
      res.send(allValidCodeNacs)
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

app.get(
  '/codenacs/:codenac',
  async (req, res, next) => {
    try {
      const codeNac = req.params.codenac
      if (!codeNac) throw new MissingValue('codenac', 'Request needs a codenac param')

      const codeNacDetails = await fetchCodeNacByNac(codeNac)
      res.send(codeNacDetails)
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

app.get(
  '/codenacs/versions/:codenac',
  async (req, res, next) => {
    try {
      const codeNac = req.params.codenac
      if (!codeNac) throw new MissingValue('codenac', 'Request needs a codenac param')

      const codeNacDetails = await fetchEveryCodeNacByNac(codeNac)
      res.send(codeNacDetails)
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

app.get(
  '/souschapitre/:code',
  async (req, res, next) => {
    try {
      const code = req.params.code
      if (!code) throw new MissingValue('sous-chapitre', 'Request needs a subchapter params')
      const everySubChapterNAC = await fetchEverySubChapter(code)
      res.send(everySubChapterNAC)
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

function parseNAC(body: unknown): WithoutId<Partial<CodeNac>> {
  const parsed = parsePartialCodeNac(body)
  if (!parsed.codeNAC) {
    throw new MissingValue('codeNAC', 'Le champ codeNAC est obligatoire.')
  }
  if (!parsed.libelleNAC) {
    throw new MissingValue('libelleNAC', 'Le champ libelleNAC est obligatoire.')
  }
  return parsed
}
app.post(
  '/codenacs',
  async (req, res, next) => {
    try {
      const codenac = parseNAC(req.body)
      const createdCodeNac: Partial<CodeNac> = await createCodeNac(codenac)
      if (createdCodeNac) res.status(201)
      res.send(createdCodeNac)
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

app.put(
  '/codenacs/:nac',
  async (req, res, next) => {
    try {
      const nac = req.params.nac
      const codenac = req.body
      if (!codenac) throw new MissingValue('codenac', 'Request needs a codenac body')
      const updatedCodeNac = await updateNacIfExistsOrCreate(codenac, nac!)
      res.send(updatedCodeNac)
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

app.delete(
  '/codenacs/:nac',
  async (req, res, next) => {
    try {
      const nac = req.params.nac
      if (!nac) throw new MissingValue('codenac', 'Request needs a codenac param')
      const deletedNAC = await deleteCodeNac(nac)
      if (deletedNAC) res.status(200)
      res.send(deletedNAC)
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

export default app
