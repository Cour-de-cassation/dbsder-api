import { NextFunction, Request, Response } from 'express'
import { apiKeyToService, Service } from '../services/authentication'
import { ForbiddenError, UnauthorizedError } from '../services/error'

declare global {
  namespace Express {
    interface Request {
      context?: { service: Service }
    }
  }
}

//Bloquer tout les autres routes pour ne donner accès qu'à la rounte /codenacs à JURINACS
const ROUTE_PERMISSIONS: Partial<Record<Service, RegExp[]>> = {
  [Service.JURINACS]: [/^\/codenacs/]
}

export const apiKeyHandler = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key']
    if (typeof apiKey !== 'string') throw new UnauthorizedError()
    const service = apiKeyToService(apiKey)
    req.context = { service }
    const allowedRoutes = ROUTE_PERMISSIONS[service]
    if (allowedRoutes) {
      const isAllowed = allowedRoutes.some((route) => route.test(req.path))
      if (!isAllowed)
        throw new ForbiddenError(`Service ${service} is not allowed to access ${req.path}`)
    }
    next()
  } catch (err) {
    next(err)
  }
}
