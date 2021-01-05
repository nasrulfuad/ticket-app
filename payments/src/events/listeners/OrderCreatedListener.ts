import { Listener, OrderCreatedEvent, Subjects } from "@nftickets/common";
import { Message } from "node-nats-streaming";

import { Order } from "../../models";
import { queueGroupName } from "./QueueGroupName";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    await Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    }).save();

    msg.ack();
  }
}
