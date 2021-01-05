import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@nftickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";

import { queueGroupName } from "./QueueGroupName";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) throw new Error("Order not found");

    await order.set({ status: OrderStatus.Cancelled }).save();

    msg.ack();
  }
}
