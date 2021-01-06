import request from "supertest";
import { Types } from "mongoose";
import app from "../../app";
import { Order, Payment } from "../../models";
import { OrderStatus } from "@nftickets/common";
import { stripe } from "../../stripe";

// jest.mock("../../stripe");

it("Returns a 401 if the user does not logged in", async () => {
  await request(app).post("/api/payments").send({}).expect(401);
});

it("Returns a 404 if the order does not exist", async () => {
  await requestPayment(
    {
      token: "asas",
      orderId: Types.ObjectId().toHexString(),
    },
    global.signin()
  ).expect(404);
});

it("Return 401 when the order does not belong to the user", async () => {
  const order = await Order.build({
    id: Types.ObjectId().toHexString(),
    userId: Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  }).save();

  await requestPayment(
    { token: "asas", orderId: order.id },
    global.signin()
  ).expect(401);
});

it("Return 400 when the order was expired", async () => {
  const userId = Types.ObjectId().toHexString();

  const order = await Order.build({
    id: Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
    userId,
  }).save();

  await requestPayment(
    {
      token: "asas",
      orderId: order.id,
    },
    global.signin(userId)
  ).expect(400);
});

it("Return a 204 with a valid input", async () => {
  const userId = Types.ObjectId().toHexString();

  const price = Math.floor(Math.random() * 100000);

  const order = await Order.build({
    id: Types.ObjectId().toHexString(),
    version: 0,
    price,
    status: OrderStatus.Created,
    userId,
  }).save();

  await requestPayment(
    { token: "tok_visa", orderId: order.id },
    global.signin(userId)
  ).expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });

  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === price * 100
  );

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });

  expect(stripeCharge).toBeDefined();

  expect(stripeCharge!.currency).toEqual("usd");

  expect(payment).not.toBeNull();
});

function requestPayment(
  data: { token: string; orderId: string },
  cookie: string[]
) {
  return request(app).post("/api/payments").set("Cookie", cookie).send(data);
}
