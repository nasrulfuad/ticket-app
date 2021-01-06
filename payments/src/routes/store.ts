import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requiredAuthMiddleware,
  validateRequestMiddleware,
} from "@nftickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models";

const router = express.Router();

router.post(
  "/api/payments",
  requiredAuthMiddleware,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequestMiddleware,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError("The order was expired");

    res.json({ success: true });
  }
);

export { router as store };
