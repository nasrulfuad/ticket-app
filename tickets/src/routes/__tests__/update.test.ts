import request from "supertest";
import { Types } from "mongoose";

import app from "../../app";
import { natsClient } from "../../NatsClient";
import { Subjects } from "@nftickets/common";
import { Ticket } from "../../models";

const createTicket = (cookie: string[]) =>
  request(app).post("/api/tickets").set("Cookie", cookie).send({
    title: "Some stuff",
    price: 10,
  });

const updateTicket = (id: string, cookie: string[], newTicket: object) =>
  request(app).put(`/api/tickets/${id}`).set("Cookie", cookie).send(newTicket);

it("Return 404 if the provided id doesn't exists", async () => {
  const id = new Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "Some stuff",
      price: 10,
    })
    .expect(404);
});

it("Return 401 if the user is not signed in", async () => {
  const id = new Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "Some stuff",
      price: 10,
    })
    .expect(401);
});

it("Return 401 if the user doesn't own the ticket", async () => {
  const response = await createTicket(global.signin());

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "New some stuff",
      price: 3000,
    })
    .expect(401);
});

it("Return 400 if the user provided invalid title or price", async () => {
  const cookie = global.signin();

  const response = await createTicket(cookie);

  await updateTicket(response.body.id, cookie, { title: "", price: 20 }).expect(
    400
  );

  await updateTicket(response.body.id, cookie, {
    title: "New some stuff",
    price: -20,
  }).expect(400);
});

it("Update if the ticket provided valid inputs", async () => {
  const cookie = global.signin();

  const newTicket = { title: "New some stuff", price: 100 };

  const response = await createTicket(cookie);

  await updateTicket(response.body.id, cookie, newTicket).expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual(newTicket.title);

  expect(ticketResponse.body.price).toEqual(newTicket.price);
});

it("Publishes an event", async () => {
  const cookie = global.signin();

  const newTicket = { title: "New some stuff", price: 100 };

  const response = await createTicket(cookie);

  await updateTicket(response.body.id, cookie, newTicket).expect(200);

  expect(natsClient.client.publish).toHaveBeenLastCalledWith(
    Subjects.TicketUpdated,
    expect.anything(),
    expect.anything()
  );
});

it("Rejects updates if the ticket is reserved", async () => {
  const cookie = global.signin();

  const newTicket = { title: "New some stuff", price: 100 };

  const { body } = await createTicket(cookie);

  const ticket = await Ticket.findById(body.id);

  await ticket!.set({ orderId: Types.ObjectId().toHexString() }).save();

  await updateTicket(body.id, cookie, newTicket).expect(400);
});
