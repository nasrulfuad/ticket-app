import {
  NotAuthorizedError,
  NotFoundError,
  requiredAuthMiddleware,
} from "@nftickets/common";
import express, { Request, Response } from "express";
import { Order } from "../models";
const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requiredAuthMiddleware,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    return res.json(order);
  }
);

export { router as show };
