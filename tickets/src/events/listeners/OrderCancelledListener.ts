import { Listener, OrderCancelledEvent, Subjects } from "@nftickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models";
import { TicketUpdatedPublisher } from "../publishers/TicketUpdatedPublisher";
import { queueGroupName } from "./QueueGroupName";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) throw new Error("Ticket not found");

    await ticket.set({ orderId: undefined }).save();

    await new TicketUpdatedPublisher(this.client).publish(ticket);

    msg.ack();
  }
}
