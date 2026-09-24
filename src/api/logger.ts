import { Request, Response, NextFunction } from 'express'

export const requestLog = (req: Request, _: Response, next: NextFunction) => {
  req.log.info({
    path: 'src/controller/logger.ts',
    operations: ['other', 'request received'],
    message: `${req.method} ${req.path} received from service: ${req.context?.service ?? 'unknown'}`
  })
  next()
}

export const responseLog = (req: Request, res: Response) => {
  res.log.info({
    path: 'src/controller/logger.ts',
    operations: ['other', 'request responded'],
    message: `${req.method} ${req.path} responded with statusCode: ${res.statusCode}`
  })
}
