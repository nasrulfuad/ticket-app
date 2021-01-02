import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import { Ticket, Order, OrderStatus } from "../../models";
import { natsClient } from "../../NatsClient";

it("Can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/orders").send({}).expect(401);
});

it("Returns an error if the ticket does not exist", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it("Return an error if the ticket is already reserved", async () => {
  const ticket = await Ticket.build({
    title: "Concert",
    price: 20,
  }).save();

  await Order.build({
    ticket,
    userId: "qweasdqweasd",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  }).save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("Reserve a ticket", async () => {
  const ticket = await Ticket.build({
    title: "Concert",
    price: 20,
  }).save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it("Emit an order created event", async () => {
  const ticket = await Ticket.build({
    title: "Concert",
    price: 20,
  }).save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
