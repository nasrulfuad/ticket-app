import express, { Request, Response } from "express";
import {
  requiredAuthMiddleware,
  validateRequestMiddleware,
} from "@nftickets/common";
import { body } from "express-validator";
import { natsClient } from "../NatsClient";

const router = express.Router();

router.post("/api/orders", async (req: Request, res: Response) => {
  return res.status(201).json({});
});

export { router as store };
