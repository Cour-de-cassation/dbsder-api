import { NextFunction, Request, Response } from 'express'
import {
  isCustomError
} from '../library/error'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- always define express error middleware with 4 parameters */
export const errorHandler = (err: Error, req: Request, res: Response, _: NextFunction) => {
  req.log.error(err)

  if (!isCustomError(err)) {
    res.status(500)
    return res.send({ message: "Something wrong on server, please contact us" });
  }

  switch (err.type) {
    case "notSupported":
    case "missingValue":
      res.status(400);
      break
    case 'notFound':
      res.status(404)
      break
    case 'unauthorizedError':
      res.status(401)
      break
    case 'forbiddenError':
      res.status(403)
      break
  }

  return res.send({ message: err.message })
}
