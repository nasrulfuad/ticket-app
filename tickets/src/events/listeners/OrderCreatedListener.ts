import { Listener, OrderCreatedEvent, Subjects } from "@nftickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models";
import { TicketUpdatedPublisher } from "../publishers/TicketUpdatedPublisher";
import { queueGroupName } from "./QueueGroupName";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) throw new Error("Ticket not found");

    await ticket.set({ orderId: data.id }).save();

    await new TicketUpdatedPublisher(this.client).publish(ticket);

    msg.ack();
  }
}
