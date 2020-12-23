import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export function currentUserMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
) {
  if (!req.session?.jwt) return next();

  try {
    const payload = jsonwebtoken.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    req.currentUser = payload;
  } catch (error) {}
  next();
}
