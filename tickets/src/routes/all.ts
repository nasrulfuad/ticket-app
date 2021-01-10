import { NotFoundError } from "@nftickets/common";
import express, { Request, Response } from "express";
import { Ticket } from "../models";

const router = express.Router();

router.get("/api/tickets", async (_: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined,
  });

  if (tickets.length === 0) throw new NotFoundError();

  return res.json(tickets);
});

export { router as all };
