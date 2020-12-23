import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { NotFoundError } from "./errors";
import { errorHandlerMiddleware } from "./middlewares";
import {
  currentUserRouter,
  signinRouter,
  signupRouter,
  logoutRouter,
} from "./routes/";

const app = express();
const PORT = 3000;

app.set("trust proxy", 1);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(logoutRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandlerMiddleware);

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
