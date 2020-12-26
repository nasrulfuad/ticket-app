import express, { Request, Response } from "express";
import {
  requiredAuthMiddleware,
  validateRequestMiddleware,
} from "@nftickets/common";
import { body } from "express-validator";
import { Ticket } from "../models";

const router = express.Router();

router.post(
  "/api/tickets",
  requiredAuthMiddleware,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequestMiddleware,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    return res.status(201).json(ticket);
  }
);

export { router as store };
