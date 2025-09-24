import { NextFunction, Request, Response } from 'express'
import { isCustomError } from '../library/error'
import { responseLog } from './logger'

/* eslint-disable @typescript-eslint/no-unused-vars -- maybe we can remove */
export const errorHandler = (err: Error, req: Request, res: Response, _: NextFunction) => {
  req.log.error({
    path: 'src/controller/error.ts',
    operations: ['other', `${req.method} ${req.path}`],
    message: `${err}`,
    error: err
  })

  if (isCustomError(err)) {
    switch (err.type) {
      case 'notSupported':
      case 'missingValue':
        res.status(400)
        res.send({ error: err })
        return responseLog(req, res)
      case 'notFound':
        res.status(404)
        res.send({ error: err })
        return responseLog(req, res)
      case 'unauthorizedError':
        res.status(401)
        res.send({ error: err })
        return responseLog(req, res)
      case 'forbiddenError':
        res.status(403)
        res.send({ error: err })
        return responseLog(req, res)
    }
  }

  res.status(500)
  res.send({ error: 'Something wrong on server, please contact us' })
  return responseLog(req, res)
}
