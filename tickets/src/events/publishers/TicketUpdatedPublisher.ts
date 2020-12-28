import { Publisher, Subjects, TicketUpdatedEvent } from "@nftickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
