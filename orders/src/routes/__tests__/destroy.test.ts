import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { Order, OrderStatus, Ticket } from "../../models";
import { natsClient } from "../../NatsClient";

it("Can only be accessed if the user is signed in", async () => {
  const orderId = mongoose.Types.ObjectId();
  await request(app).delete(`/api/orders/${orderId}`).send({}).expect(401);
});

it("Marks an order as cancelled", async () => {
  const ticket = await createTicket("Ticket one");
  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Emits an event that order was cancelled", async () => {
  const ticket = await createTicket("Ticket one");
  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsClient.client.publish).toHaveBeenCalledTimes(2);
});

function createTicket(title: string) {
  return Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title,
    price: 20,
  }).save();
}
