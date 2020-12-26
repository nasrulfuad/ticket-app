import request from "supertest";

import app from "../../app";

const createTicket = () =>
  request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "Some stuff",
    price: 10,
  });

it("Return 404 if tickets doesn't exists", async () => {
  await request(app).get("/api/tickets").send({}).expect(404);
});

it("Can fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send({}).expect(200);

  expect(response.body.length).toEqual(3);
});
