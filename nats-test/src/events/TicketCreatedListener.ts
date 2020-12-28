import { Message } from "node-nats-streaming";

import { Subjects } from "./Subjects";
import { Listener } from "./AbstracListener";
import { TicketCreatedEventInterface } from "./TicketCreatedEventInterface";

export class TicketCreatedListener extends Listener<TicketCreatedEventInterface> {
  readonly subject = Subjects.TicketCreated;

  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEventInterface["data"], msg: Message) {
    console.log("Event data: ", data);

    msg.ack();
  }
}
