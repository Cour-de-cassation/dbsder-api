import { Router } from 'express'
import { responseLog } from './logger'
import { MissingValue } from '../services/error'
import { fetchJurisdictionByCode } from '../services/codeJurisdiction/handler'

const app = Router()

app.get(
  '/codejurisdiction/:codeJurisdiction',
  async (req, res, next) => {
    try {
      const codeJurisdiction = req.params.codeJurisdiction
      if (!codeJurisdiction)
        throw new MissingValue('codeJurisdiction', 'Request needs a codeJurisdiction param')

      const responseCodeJurisdiction = await fetchJurisdictionByCode(codeJurisdiction)
      res.send(responseCodeJurisdiction)
      next()
    } catch (err: unknown) {
      next(err)
    }
  },
  responseLog
)

export default app
