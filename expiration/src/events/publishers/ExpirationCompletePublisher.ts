import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@nftickets/common";

export class ExpirationCompletePubslisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
