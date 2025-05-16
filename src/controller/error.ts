import { NextFunction, Request, Response } from 'express'
import {
  MissingValue,
  NotFound,
  NotSupported,
  UnauthorizedError,
  ForbiddenError,
  UnexpectedError
} from '../library/error'

type ApiError =
  | NotSupported
  | MissingValue
  | NotFound
  | UnauthorizedError
  | ForbiddenError
  | UnexpectedError

/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- define express error middleware with 4 parameters is better for readability */
export const errorHandler = (err: ApiError, req: Request, res: Response, _: NextFunction) => {
  req.log.error(err)

  switch (err?.type) {
    case 'notSupported':
    case 'missingValue':
      res.status(400)
      res.send({ message: err.message })
      break
    case 'notFound':
      res.status(404)
      res.send({ message: err.message })
      break
    case 'unauthorizedError':
      res.status(401)
      res.send({ message: err.message })
      break
    case 'forbiddenError':
      res.status(403)
      res.send({ message: err.message })
      break
    default:
      res.status(500)
      res.send({ message: 'Something wrong on server, please contact us' })
      break
  }
}
