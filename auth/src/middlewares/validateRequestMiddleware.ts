import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { RequestValidationError } from "../errors";

export function validateRequestMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  return next();
}
