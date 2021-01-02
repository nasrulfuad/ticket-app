import { Publisher, Subjects, OrderCancelledEvent } from "@nftickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
