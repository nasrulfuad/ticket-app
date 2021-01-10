import mongoose from "mongoose";
import app from "./app";
import { OrderCancelledListener } from "./events/listeners/OrderCancelledListener";
import { OrderCreatedListener } from "./events/listeners/OrderCreatedListener";
import { natsClient } from "./NatsClient";
const PORT = 3000;

const start = async () => {
  console.info("Starting up...");

  try {
    const requiredEnv = [
      "JWT_KEY",
      "MONGO_URI",
      "NATS_CLIENT_ID",
      "NATS_URL",
      "NATS_CLUSTER_ID",
    ];

    for (let envName of requiredEnv) {
      if (!process.env[envName]) throw new Error(`env ${envName} required`);
    }

    await natsClient.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );

    natsClient.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsClient.client.close());
    process.on("SIGTERM", () => natsClient.client.close());

    new OrderCancelledListener(natsClient.client).listen();
    new OrderCreatedListener(natsClient.client).listen();

    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Connected to MONGO_DB");
  } catch (error) {
    console.log(error);
  }

  app.listen(PORT, () =>
    console.info(`🚀️ [ Tickets ] service is running on port ${PORT} ✈️`)
  );
};

start();
