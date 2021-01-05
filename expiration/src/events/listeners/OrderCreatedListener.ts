import { Listener, OrderCreatedEvent, Subjects } from "@nftickets/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/ExpirationQueue";

import { queueGroupName } from "./QueueGroupName";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log("Menunggu untuk expired selama : ", delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}