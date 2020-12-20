import express from "express";
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

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(PORT, () =>
  console.info(`🚀️ [ Auth ] service is running on port ${PORT} ✈️`)
);
