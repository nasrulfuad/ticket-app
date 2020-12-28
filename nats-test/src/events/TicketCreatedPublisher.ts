import { Publisher } from "./AbstractPublisher";
import { Subjects } from "./Subjects";
import { TicketCreatedEventInterface } from "./TicketCreatedEventInterface";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEventInterface> {
  readonly subject = Subjects.TicketCreated;
}
