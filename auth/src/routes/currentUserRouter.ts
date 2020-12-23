import express, { Request, Response } from "express";
import { currentUserMiddleware } from "../middlewares";

const router = express.Router();

router.get(
  "/api/users/current-user",
  currentUserMiddleware,
  (req: Request, res: Response) => {
    res.json({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
