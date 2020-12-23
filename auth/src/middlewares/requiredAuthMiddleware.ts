import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors";

export function requiredAuthMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
) {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  return next();
}
