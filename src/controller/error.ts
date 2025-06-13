import { NextFunction, Request, Response } from 'express'
import { isCustomError } from '../library/error'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- always define express error middleware with 4 parameters */
export const errorHandler = (err: Error, req: Request, res: Response, _: NextFunction) => {
  req.log.error(err)

  if (isCustomError(err)) {
    switch (err.type) {
      case 'notSupported':
        res.status(400)
        res.send({ message: err.message, explain: err.explain ?? null })
        return
      case 'missingValue':
        res.status(400)
        res.send({ message: err.message })
        return
      case 'notFound':
        res.status(404)
        res.send({ message: err.message })
        return
      case 'unauthorizedError':
        res.status(401)
        res.send({ message: err.message })
        return
      case 'forbiddenError':
        res.status(403)
        res.send({ message: err.message })
        return
    }
  }

  res.status(500)
  res.send({ message: 'Something wrong on server, please contact us' })
  return
}
