import { Request, Response, NextFunction } from "express";
import { CustomErrorAbstract } from "../errors/CustomErrorsAbstract";

export function errorHandlerMiddleware(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
) {
  if (err instanceof CustomErrorAbstract) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }

  return res.status(400).json({
    errors: [{ message: "Something went wrong" }],
  });
}
