import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";
import { Ticket } from "../../models";

it("Fetches orders for a particular user", async () => {
  const ticketOne = await createTicket("Ticket #1");
  const ticketTwo = await createTicket("Ticket #2");
  const ticketThree = await createTicket("Ticket #3");

  const userOne = global.signin();
  const userTwo = global.signin();

  /** Create #1 order for user one */
  await requestToCreateOrder(ticketOne.id, userOne).expect(201);

  /** Create #2 orders for user two */
  const { body: orderTwo } = await requestToCreateOrder(
    ticketTwo.id,
    userTwo
  ).expect(201);

  const { body: orderThree } = await requestToCreateOrder(
    ticketThree.id,
    userTwo
  ).expect(201);

  /** Make request to get orders for user two */
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  /** Make sure we only got the orders for user two */
  expect(response.body.length).toEqual(2);

  expect(response.body[0].id).toEqual(orderTwo.id);
  expect(response.body[1].id).toEqual(orderThree.id);

  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});

function createTicket(title: string) {
  return Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title,
    price: 20,
  }).save();
}

function requestToCreateOrder(ticketId: string, cookie: string[]) {
  return request(app).post("/api/orders").set("Cookie", cookie).send({
    ticketId,
  });
}
