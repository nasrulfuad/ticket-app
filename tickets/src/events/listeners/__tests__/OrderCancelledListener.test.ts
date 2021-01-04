import { OrderCancelledEvent } from "@nftickets/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

import { Ticket } from "../../../models";
import { natsClient } from "../../../NatsClient";
import { OrderCancelledListener } from "../OrderCancelledListener";

it("Update the ticket orderId to undefined, publishes an event and acks the message", async () => {
  const { listener, data, msg, ticket, orderId } = await setupListener();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();

  expect(natsClient.client.publish).toHaveBeenCalled();

  expect(msg.ack).toHaveBeenCalled();
});

async function setupListener() {
  const listener = new OrderCancelledListener(natsClient.client);

  const orderId = mongoose.Types.ObjectId().toHexString();

  const ticket = await Ticket.build({
    title: "Movie",
    price: 10,
    userId: "random",
  })
    .set({ orderId })
    .save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket, orderId };
}
