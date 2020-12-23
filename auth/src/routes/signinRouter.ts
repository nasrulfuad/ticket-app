import express, { Request, Response } from "express";
import { body } from "express-validator";
import jsonwebtoken from "jsonwebtoken";

import { BadRequestError } from "../errors";
import { validateRequestMiddleware } from "../middlewares";
import { User } from "../models";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password must not be empty"),
  ],
  validateRequestMiddleware,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }

    const isPasswordMatch = await Password.compare(user.password, password);

    if (!isPasswordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const jwt = jsonwebtoken.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt,
    };

    res.status(200).json(user);
  }
);

export { router as signinRouter };
