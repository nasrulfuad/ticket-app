import express, { Request, Response } from "express";
const router = express.Router();

router.delete("/api/orders/:id", async (_: Request, res: Response) => {
  return res.json({});
});

export { router as destroy };
