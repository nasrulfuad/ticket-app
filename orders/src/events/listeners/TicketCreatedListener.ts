import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@nftickets/common";
import { Ticket } from "../../models";
import { queueGroupName } from "./QueueGroupName";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    await Ticket.build({
      id,
      title,
      price,
    }).save();

    msg.ack();
  }
}
