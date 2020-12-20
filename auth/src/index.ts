import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import { NotFoundError } from "./errors";
import { errorHandler } from "./middlewares/error-handler";
import {
  currentuserRouter,
  signinRouter,
  signupRouter,
  logoutRouter,
} from "./routes/";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(currentuserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(logoutRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  try {
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
