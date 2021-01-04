import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@nftickets/common";

import { Ticket } from "../../../models";
import { natsClient } from "../../../NatsClient";
import { OrderCreatedListener } from "../OrderCreatedListener";

it("Sets the userId of the ticket", async () => {
  const { listener, data, msg, ticket } = await setupListener();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("Acks the message", async () => {
  const { listener, data, msg } = await setupListener();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("Publishes a ticket updated event", async () => {
  const { listener, data, msg } = await setupListener();

  await listener.onMessage(data, msg);

  const ticketUpdatedData = JSON.parse(
    (natsClient.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(natsClient.client.publish).toHaveBeenCalled();

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});

async function setupListener() {
  const listener = new OrderCreatedListener(natsClient.client);

  const ticket = await Ticket.build({
    title: "Movie",
    price: 10,
    userId: "random",
  }).save();

  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "random2",
    expiresAt: "random3",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
}
