import { Subjects } from "./Subjects";

export interface TicketCreatedEventInterface {
  subject: Subjects.TicketCreated;

  data: {
    id: string;
    title: string;
    price: number;
  };
}
