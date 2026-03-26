import express, { Express, json } from 'express'
import helmet from 'helmet'

import { logger, loggerHttp } from './config/logger'
import codeNacRouter from './api/codeNac'
import decisionRouter from './api/decision'
import affaireRouter from './api/affaire'
import documentAssocieRouter from './api/documentAssocie'
import { errorHandler } from './api/error'
import { apiKeyHandler } from './api/authentication'
import { PORT } from './config/env'
import { NotFound } from './services/error'
import { requestLog } from './api/logger'

const app: Express = express()

app
  .use(helmet())
  .use(loggerHttp)
  .use(apiKeyHandler)
  .use(json({ limit: '10mb' }))

  .use(requestLog)
  .use(codeNacRouter)
  .use(decisionRouter)
  .use(affaireRouter)
  .use(documentAssocieRouter)

  .use((req, _, next) => next(new NotFound('path', `${req.method} ${req.path} doesn't exists`)))
  .use(errorHandler)

app.listen(PORT as number, '0.0.0.0', () => {
  logger.info({
    path: 'src/server.ts',
    operations: ['other', 'startServer'],
    message: `DBSDER-API running on port ${PORT}`
  })
})
