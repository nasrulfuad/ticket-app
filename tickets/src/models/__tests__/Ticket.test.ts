import { Ticket } from "../Ticket";

it("Implements optimistic concurrency control", async (done) => {
  const ticket = await Ticket.build({
    title: "movie",
    price: 5,
    userId: "osaas",
  }).save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (error) {
    return done();
  }

  throw new Error("Should not reach this point");
});

it("Increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "movie",
    price: 5,
    userId: "osaas",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
