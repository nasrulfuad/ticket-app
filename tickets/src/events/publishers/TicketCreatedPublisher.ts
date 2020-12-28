import { Publisher, Subjects, TicketCreatedEvent } from "@nftickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
