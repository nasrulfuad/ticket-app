import { requiredAuthMiddleware } from "@nftickets/common";
import express, { Request, Response } from "express";

import { Order } from "../models";

const router = express.Router();

router.get(
  "/api/orders",
  requiredAuthMiddleware,
  async (req: Request, res: Response) => {
    const orders = await Order.find({ userId: req.currentUser!.id }).populate(
      "ticket"
    );

    res.json(orders);
  }
);

export { router as all };
