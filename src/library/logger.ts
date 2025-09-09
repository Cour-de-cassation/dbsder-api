import pino, { Logger, LoggerOptions } from "pino";
import pinoHttp from "pino-http";
import { NODE_ENV } from "./env";
import { Request } from "express";
import { randomUUID } from "crypto";

type DecisionLog = {
  decision: { 
    _id?: string, 
    sourceId: string, 
    sourceName: string, 
    publishStatus?: string, 
    labelStatus?: string 
  }
  path: string
  operations: readonly ["normalization" | "other", string]
  message?: string
}

type TechLog = {
  path: string
  operations: readonly ["normalization" | "other", string]
  message?: string
}

const pinoPrettyConf = {
  target: "pino-pretty",
  options: {
    singleLine: true,
    colorize: true,
    translateTime: "UTC:dd-mm-yyyy - HH:MM:ss Z",
  },
};

const loggerOptions: LoggerOptions = {
  base: { appName: "dbsder-api" },
  formatters: {
    level: (label) => {
      return {
        logLevel: label.toUpperCase(),
      };
    },
    log: (content) => ({
      ...content,
      type: Object.keys(content).includes("decison") ? "decision" : "tech",
      appName: "dbsder-api",
    })
  },
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
  redact: {
    paths: [
      "req",
      "res",
      "headers",
      "ip",
      "responseTime",
      "hostname",
      "pid",
      "level",
    ],
    censor: "",
    remove: true,
  },
  transport:
    NODE_ENV === "development" ? pinoPrettyConf : undefined,
};

export type CustomLogger = Omit<Logger, 'error'|'warn'|'info'> & {
  error: (a: TechLog) => void,
  warn: (a: TechLog) => void,
  info: (a: TechLog | DecisionLog) => void,
}

declare module "http" {
  interface IncomingMessage {
    logSafe: CustomLogger;
    allLogsSafe: CustomLogger[];
  }

  interface OutgoingMessage {
    logSafe: CustomLogger;
    allLogsSafe: CustomLogger[];
  }
}

export const logger: CustomLogger = pino(loggerOptions);

export const loggerHttp = pinoHttp<Request>({
  logger,
  autoLogging: false,
  genReqId: () => randomUUID(),
});
