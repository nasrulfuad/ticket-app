import { natsClient } from "./NatsClient";
const PORT = 3000;

const start = async () => {
  try {
    const requiredEnv = ["NATS_CLIENT_ID", "NATS_URL", "NATS_CLUSTER_ID"];

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
  } catch (error) {
    console.log(error);
  }
};

start();
