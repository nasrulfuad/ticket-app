import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requiredAuthMiddleware,
} from "@nftickets/common";
import express, { Request, Response } from "express";
import { OrderCancelledPublisher } from "../events/publishers/OrderCancelledPublisher";
import { Order } from "../models";
import { natsClient } from "../NatsClient";
const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requiredAuthMiddleware,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;

    await order.save();

    new OrderCancelledPublisher(natsClient.client).publish({
      id: order.id,
      version: order.ticket.version - 1,
      ticket: {
        id: order.ticket.id,
      },
    });

    return res.status(204).json(order);
  }
);

export { router as destroy };
