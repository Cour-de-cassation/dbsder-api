import pino, { LoggerOptions } from "pino";
import pinoHttp from "pino-http";

const pinoPrettyConf = {
  target: "pino-pretty",
  options: {
    singleLine: true,
    colorize: true,
    translateTime: "UTC:dd-mm-yyyy - HH:MM:ss Z",
  },
};

const loggerOptions: LoggerOptions = {
  base: { appName: "dbsder-api-reloaded" },
  formatters: {
    level: (label) => {
      return {
        logLevel: label.toUpperCase(),
      };
    },
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
    process.env.NODE_ENV === "development" ? pinoPrettyConf : undefined,
};

export const logger = pino(loggerOptions);

export const loggerHttp = pinoHttp(loggerOptions); // attach logger instance at req (req.log will log message and req info)
