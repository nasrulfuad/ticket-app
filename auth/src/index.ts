import mongoose from "mongoose";
import app from "./app";
const PORT = 3000;

const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("env JWT_KEY required");
    }

    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
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
