import Queue from "bull";
import { ExpirationCompletePubslisher } from "../events/publishers/ExpirationCompletePublisher";
import { natsClient } from "../NatsClient";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.info("ORDER EXPIRED : ", job.data.orderId);

  new ExpirationCompletePubslisher(natsClient.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
