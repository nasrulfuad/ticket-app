import { Publisher, Subjects, PaymentCreatedEvent } from "@nftickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
