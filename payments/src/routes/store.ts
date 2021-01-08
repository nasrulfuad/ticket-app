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
import { PaymentCreatedPublisher } from "../events/publishers/PaymentCreatedPublisher";
import { Order, Payment } from "../models";
import { natsClient } from "../NatsClient";
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

    const payment = await Payment.build({
      orderId,
      stripeId: charge.id,
    }).save();

    await new PaymentCreatedPublisher(natsClient.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    return res.status(201).json({ id: payment.id });
  }
);

export { router as store };
