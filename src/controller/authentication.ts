import { NextFunction, Request, Response, Router, urlencoded } from "express";
import { apiKeyToService, Service } from "../service/authentication";
import { unauthorizedError } from "../library/error";

declare global {
  namespace Express {
    interface Request {
      context: { service: Service };
    }
  }
}

export const apiKeyHandler = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers["x-api-key"];
    if (typeof apiKey !== "string") throw unauthorizedError(new Error());
    const service = apiKeyToService(apiKey);
    req.context.service = service;
    next();
  } catch (err) {
    next(err);
  }
};
