import pino, { Logger, LoggerOptions } from 'pino'
import { NODE_ENV } from './env'
import { Handler } from 'express'
import { randomUUID } from 'crypto'

type DecisionLog = {
  decision: {
    _id?: string
    sourceId: string
    sourceName: string
    publishStatus?: string
    labelStatus?: string
  }
  path: string
  operations: readonly ['normalization', string]
  message?: string
}

type TechLog = {
  path: string
  operations: readonly ['normalization' | 'other', string]
  message?: string
}

const pinoPrettyConf = {
  target: 'pino-pretty',
  options: {
    singleLine: true,
    colorize: true,
    translateTime: 'UTC:dd-mm-yyyy - HH:MM:ss Z'
  }
}

const loggerOptions: LoggerOptions = {
  formatters: {
    level: (label) => {
      return {
        logLevel: label.toUpperCase()
      }
    },
    log: (content) => ({
      ...content,
      type: Object.keys(content).includes('decison') ? 'decision' : 'tech',
      appName: 'dbsder-api'
    })
  },
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
  redact: {
    paths: ['req', 'res', 'headers', 'ip', 'responseTime', 'hostname', 'pid', 'level'],
    censor: '',
    remove: true
  },
  transport: NODE_ENV === 'development' ? pinoPrettyConf : undefined
}

export type CustomLogger = Omit<Logger, 'error' | 'warn' | 'info'> & {
  error: (a: TechLog & { error: unknown }) => void
  warn: (a: TechLog) => void
  info: (a: TechLog | DecisionLog) => void
}

export const logger: CustomLogger = pino(loggerOptions)

declare module 'http' {
  interface IncomingMessage {
    log: CustomLogger
    allLogs: CustomLogger[]
  }

  interface OutgoingMessage {
    log: CustomLogger
    allLogs: CustomLogger[]
  }
}

export const loggerHttp: Handler = (req, res, next) => {
  const requestId = randomUUID()

  const httpLogger = pino({
    ...loggerOptions,
    formatters: {
      ...loggerOptions.formatters,
      log: (content) => ({
        ...content,
        type: Object.keys(content).includes('decison') ? 'decision' : 'tech',
        appName: 'dbsder-api',
        requestId
      })
    }
  })

  req.log = httpLogger
  res.log = httpLogger
  next()
}
