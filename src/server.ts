import express, { Express, json } from 'express'
import helmet from 'helmet'

import { logger, loggerHttp } from './library/logger'
import codeNacRouter from './controller/codeNac'
import decisionRouter from './controller/decision'
import { errorHandler } from './controller/error'
import { apiKeyHandler } from './controller/authentication'
import { PORT } from './library/env'
import { NotFound } from './library/error'
import { requestLog } from './controller/logger'

const app: Express = express()

app
  .use(helmet())
  .use(loggerHttp)
  .use(apiKeyHandler)
  .use(json({ limit: '10mb' }))

  .use(requestLog)
  .use(codeNacRouter)
  .use(decisionRouter)

  .use((req, _, next) => next(new NotFound('path', `${req.method} ${req.path} doesn't exists`)))
  .use(errorHandler)

app.listen(PORT, () => {
  logger.info({
    path: 'src/server.ts',
    operations: ['other', 'startServer'],
    message: `DBSDER-API running on port ${PORT}`
  })
})
