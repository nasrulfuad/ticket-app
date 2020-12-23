import express from "express";
import "express-async-errors";
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

app.set("trust proxy", 1);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
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

export default app;
