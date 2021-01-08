import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from "@nftickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";

import { queueGroupName } from "./QueueGroupName";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: PaymentCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId);

    if (!order) throw new Error("Order not found");

    await order.set({ status: OrderStatus.Complete }).save();

    msg.ack();
  }
}
