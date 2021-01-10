import mongoose from "mongoose";
import app from "./app";
const PORT = 3000;

// process.env.JWT_KEY = "asiap";
// process.env.MONGO_URI = "mongodb://192.168.49.2:30001/auth";

const start = async () => {
  try {
    const requiredEnv = ["JWT_KEY", "MONGO_URI"];

    for (let envName of requiredEnv) {
      if (!process.env[envName]) throw new Error(`env ${envName} required`);
    }

    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Connected to mongodb");
  } catch (error) {
    console.log(error);
  }

  app.listen(PORT, () =>
    console.info(`🚀️ [ Auth ] service is running on port ${PORT} ✈️`)
  );
};

start();
