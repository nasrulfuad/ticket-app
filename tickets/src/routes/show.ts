import { NotFoundError } from "@nftickets/common";
import express, { Request, Response } from "express";
import { Ticket } from "../models";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) throw new NotFoundError();

  return res.json(ticket);
});

export { router as show };
