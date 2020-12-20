import { Request, Response, NextFunction } from "express";
import { CustomErrorAbstract } from "../errors/CustomErrorsAbstract";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CustomErrorAbstract) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }

  console.log(err);

  return res.status(400).json({
    errors: [{ message: "Something went wrong" }],
  });
}
