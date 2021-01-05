import { OrderCreatedEvent, OrderStatus } from "@nftickets/common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models";

import { natsClient } from "../../../NatsClient";
import { OrderCreatedListener } from "../OrderCreatedListener";

it("Replicates the order info", async () => {
  const { listener, data, msg } = setupListener();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it("Acks the message", async () => {
  const { listener, data, msg } = setupListener();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

function setupListener() {
  const listener = new OrderCreatedListener(natsClient.client);

  const data: OrderCreatedEvent["data"] = {
    id: Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "a",
    userId: "asiap",
    status: OrderStatus.Created,
    ticket: {
      id: "asas",
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
}
