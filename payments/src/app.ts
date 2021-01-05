import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import {
  NotFoundError,
  errorHandlerMiddleware,
  currentUserMiddleware,
} from "@nftickets/common";

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserMiddleware);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandlerMiddleware);

export default app;
