import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requiredAuthMiddleware,
  validateRequestMiddleware,
} from "@nftickets/common";
import { body } from "express-validator";
import { Ticket } from "../models";
import { natsClient } from "../NatsClient";
import { TicketUpdatedPublisher } from "../events/publishers/TicketUpdatedPublisher";

const router = express.Router();

router.put(
  "/api/tickets/:id",
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

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) throw new NotFoundError();

    if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    await new TicketUpdatedPublisher(natsClient.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    return res.json(ticket);
  }
);

export { router as update };
