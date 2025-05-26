import express, { Express, json, NextFunction, Request, Response } from 'express'
import helmet from 'helmet'

import { logger, loggerHttp } from './library/logger'
import codeNacRouter from './controller/codeNac'
import decisionRouter from './controller/decision'
import labelRouter from './controller/label'
import { errorHandler } from './controller/error'
import { apiKeyHandler } from './controller/authentication'
import { PORT } from './library/env'

const app: Express = express()

app
  .use(helmet())
  .use(loggerHttp)
  .use(apiKeyHandler)
  .use(json({ limit: "10mb" }))

  .use((req: Request, _: Response, next: NextFunction) => {
    req.log.info({
      operationName: 'request',
      url: `${req.method} ${req.originalUrl}`,
      service: req.context?.service
    })
    next()
  })

  .use(codeNacRouter)
  .use(decisionRouter)
  .use(labelRouter)
  .use(errorHandler)

app.listen(PORT, () => {
  logger.info({
    operationName: 'startServer',
    msg: `DBSDER-API running on port ${PORT}`
  })
})
