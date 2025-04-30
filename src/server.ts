import express, { Express, json } from 'express'
import helmet from 'helmet'

import { loggerHttp } from './library/logger'
import codeNacRouter from './controller/codeNac'
import decisionRouter from './controller/decision'
import labelRouter from './controller/label'
import { errorHandler } from './controller/error'
import { missingValue } from './library/error'
import { apiKeyHandler } from './controller/authentication'

if (process.env.PORT == null) throw missingValue('process.env.PORT', new Error())
const { PORT } = process.env

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
