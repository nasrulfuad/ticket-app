import { Publisher, Subjects, OrderCreatedEvent } from "@nftickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
