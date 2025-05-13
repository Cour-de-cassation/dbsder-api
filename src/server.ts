import express, { Express, json } from 'express'
import helmet from 'helmet'

import { loggerHttp } from './library/logger'
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
  .use(json())
  .use(codeNacRouter)
  .use(decisionRouter)
  .use(labelRouter)
  .use(errorHandler)

app.listen(PORT)
