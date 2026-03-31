import { Request, Response, NextFunction } from 'express'
import { logger } from '../library/logger'

export const requestLog = (req: Request, _: Response, next: NextFunction) => {
  logger.info({
    path: 'src/controller/logger.ts',
    operations: ['other', `${req.method} ${req.path} received`]
  })
  next()
}

export const responseLog = (req: Request, res: Response) => {
  logger.info({
    path: 'src/controller/logger.ts',
    operations: ['other', `${req.method} ${req.path} responded`],
    message: `Done with statusCode: ${res.statusCode}`
  })
}
