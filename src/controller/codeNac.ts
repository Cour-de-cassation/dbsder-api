import { Router } from 'express'
import { fetchCodeNacByCodeNac } from '../service/codeNac/handler'
import { responseLog } from './logger'
import { MissingValue } from '../library/error'

const app = Router()

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

export default app
