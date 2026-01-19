import { Router } from 'express'
import { createCodeNac, fetchAllValidCodeNac, fetchCodeNacByCodeNac } from '../service/codeNac/handler'
import { responseLog } from './logger'
import { MissingValue } from '../library/error'

const app = Router()

app.get('/codenacs',
  async (req, res, next) => {
    try {
      const allValidCodeNacs = await fetchAllValidCodeNac()
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

      const codeNacDetails = await fetchCodeNacByCodeNac(codeNac)
      res.send(codeNacDetails)
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

app.post(
  '/codenacs',
  async (req, res, next) => {
    try {
      const codenac = req.body
      if (!codenac) throw new MissingValue('codenac', 'Request needs a codenac body')

      const createdCodeNac = await createCodeNac(codenac)
      if (createdCodeNac) res.status(201)
      res.send(createdCodeNac)
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

export default app
