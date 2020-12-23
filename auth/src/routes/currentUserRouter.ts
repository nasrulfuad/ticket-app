import express, { Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";

const router = express.Router();

router.get("/api/users/current-user", (req: Request, res: Response) => {
  if (!req.session?.jwt) return res.json({ currentUser: null });

  try {
    const payload = jsonwebtoken.verify(req.session.jwt, process.env.JWT_KEY!);

    res.json({ currentUser: payload });
  } catch (error) {
    return res.json({ currentUser: null });
  }
});

export { router as currentUserRouter };
