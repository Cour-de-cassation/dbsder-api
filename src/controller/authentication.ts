import { NextFunction, Request, Response } from 'express'
import { apiKeyToService, Service } from '../service/authentication'
import { UnauthorizedError } from '../library/error'

declare global {
  namespace Express {
    interface Request {
      context?: { service: Service }
    }
  }
}

export const apiKeyHandler = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key']
    if (typeof apiKey !== 'string') throw new UnauthorizedError()
    const service = apiKeyToService(apiKey)
    req.context = { service }

    next()
  } catch (err) {
    next(err)
  }
}
