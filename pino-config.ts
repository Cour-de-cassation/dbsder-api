export const pinoConfig = {
  pinoHttp: {
    transport: {
      target: "pino-pretty",
        options: {
        colorize: true,
          levelFirst: true,
          translateTime: "UTC:dd/mm/yyyy, h:MM:ss TT Z",
          singleLine: true
      }
      // Rajouter {
      //
      // "logLevel": "string",
      //
      // "timestamp": "date",
      //
      // "correlationID": "uuid",
      //
      // "appName": "string",
      //
      // "operationName": "createDecision",
      //
      // "data": "object des logs applicatifs"
      //
      // }
      // Champs supplémentaires quand on a une API :
      //
      // "httpMethod?": "POST | GET | ...",
      //
      // "path?": "endpoint appelé",
      //
      // "statusCode?": "200 | 400 | 404...",
    }
  }
}