import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requiredAuthMiddleware,
} from "@nftickets/common";
import express, { Request, Response } from "express";
import { Order } from "../models";
const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requiredAuthMiddleware,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;

    await order.save();

    /** Publish an event that the order was cancelled */

    return res.status(204).json(order);
  }
);

export { router as destroy };
