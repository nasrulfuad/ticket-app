import { OrderCancelledEvent, OrderStatus } from "@nftickets/common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { Order } from "../../../models";
import { natsClient } from "../../../NatsClient";
import { OrderCancelledListener } from "../OrderCancelledListener";

it("Updates the status of the order", async () => {
  const { listener, data, msg, order } = await setupListener();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Acks the message", async () => {
  const { listener, data, msg } = await setupListener();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

async function setupListener() {
  const listener = new OrderCancelledListener(natsClient.client);

  const order = await Order.build({
    id: Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: "akak",
    version: 0,
  }).save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "asas",
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
}
