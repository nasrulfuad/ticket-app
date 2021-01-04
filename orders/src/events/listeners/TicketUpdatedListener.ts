import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@nftickets/common";
import { Ticket } from "../../models";
import { queueGroupName } from "./QueueGroupName";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { title, price } = data;

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) throw new Error("Ticket not found");

    await ticket.set({ title, price }).save();

    msg.ack();
  }
}
