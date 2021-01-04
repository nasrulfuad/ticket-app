import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models";

it("Can only be accessed if the user is signed in", async () => {
  const orderId = mongoose.Types.ObjectId();
  await request(app).get(`/api/orders/${orderId}`).send({}).expect(401);
});

it("Fetches an order", async () => {
  const ticket = await createTicket("Ticket one");
  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("Return an error if one user tries to fetch another user order", async () => {
  const ticket = await createTicket("Ticket one");
  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});

function createTicket(title: string) {
  return Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title,
    price: 20,
  }).save();
}
