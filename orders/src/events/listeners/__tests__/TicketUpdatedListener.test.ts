import { TicketUpdatedEvent } from "@nftickets/common";
import mongoose from "mongoose";

import { Ticket } from "../../../models";
import { natsClient } from "../../../NatsClient";
import { TicketUpdatedListener } from "../TicketUpdatedListener";

it("Finds, update and saves a ticket", async () => {
  const { data, msg, listener, ticket } = await setupListener();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);

  expect(updatedTicket!.price).toEqual(data.price);

  expect(updatedTicket!.version).toEqual(data.version);
});

it("Acks the message", async () => {
  const { data, msg, listener, ticket } = await setupListener();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("Doesn't call ack if the event has a skipped version number", async () => {
  const { data, msg, listener, ticket } = await setupListener();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});

/**
 * Setup the listener for create
 * fake data, event and message object
 */
async function setupListener() {
  const listener = new TicketUpdatedListener(natsClient.client);

  const ticket = await Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Movie",
    price: 10,
  }).save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "New Movie",
    price: 100,
    userId: "sask",
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
}
