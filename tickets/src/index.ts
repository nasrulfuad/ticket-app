import mongoose from "mongoose";
import app from "./app";
import { natsClient } from "./NatsClient";
const PORT = 3000;

const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("env JWT_KEY required");
    }

    if (!process.env.MONGO_URI) {
      throw new Error("env MONGO_URI required");
    }

    await natsClient.connect("ticketing", "abc", "http://nats-srv:4222");

    natsClient.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsClient.client.close());
    process.on("SIGTERM", () => natsClient.client.close());

    await mongoose.connect(process.env.MONGO_URI, {
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
