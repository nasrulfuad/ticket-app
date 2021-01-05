import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  OrderStatus,
} from "@nftickets/common";
import { Message } from "node-nats-streaming";

import { Order } from "../../models";
import { natsClient } from "../../NatsClient";
import { OrderCancelledPublisher } from "../publishers/OrderCancelledPublisher";
import { queueGroupName } from "./QueueGroupName";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) throw new Error("Order not found");

    // if (order.status === OrderStatus.Complete) return msg.ack();

    await order.set({ status: OrderStatus.Cancelled }).save();

    await new OrderCancelledPublisher(natsClient.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
