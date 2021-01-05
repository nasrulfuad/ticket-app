import { ExpirationCompleteEvent } from "@nftickets/common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { Order, OrderStatus, Ticket } from "../../../models";
import { natsClient } from "../../../NatsClient";
import { ExpirationCompleteListener } from "../ExpirationCompleteListener";

it("Updates the order status to cancelled", async () => {
  const { listener, order, data, msg } = await setupListener();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Emits an OrderCancelled event", async () => {
  const { listener, order, data, msg } = await setupListener();

  await listener.onMessage(data, msg);

  expect(natsClient.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsClient.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it("Acks the message", async () => {
  const { listener, data, msg } = await setupListener();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

async function setupListener() {
  const listener = new ExpirationCompleteListener(natsClient.client);

  const ticket = await Ticket.build({
    id: Types.ObjectId().toHexString(),
    title: "movie",
    price: 20,
  }).save();

  const order = await Order.build({
    status: OrderStatus.Created,
    userId: "oakos",
    expiresAt: new Date(),
    ticket,
  }).save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
}
