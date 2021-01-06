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
import { Order, Payment } from "../models";
import { stripe } from "../stripe";

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

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    await Payment.build({
      orderId,
      stripeId: charge.id,
    }).save();

    return res.status(201).json({ success: true });
  }
);

export { router as store };
