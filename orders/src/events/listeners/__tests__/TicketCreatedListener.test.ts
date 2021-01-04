import { TicketCreatedEvent } from "@nftickets/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

import { natsClient } from "../../../NatsClient";
import { TicketCreatedListener } from "../TicketCreatedListener";
import { Ticket } from "../../../models";

it("Creates and saves a ticket", async () => {
  const { listener, data, msg } = setupListener();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();

  expect(ticket!.title).toEqual(data.title);

  expect(ticket!.price).toEqual(data.price);
});

it("Acks the message", async () => {
  const { listener, data, msg } = setupListener();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

/**
 * Setup the listener for create
 * fake data, event and message object
 */
function setupListener() {
  const listener = new TicketCreatedListener(natsClient.client);

  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Movie",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
}
