import express, { Request, Response } from "express";
import { body } from "express-validator";
import jsonwebtoken from "jsonwebtoken";
import { BadRequestError } from "../errors";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) throw new BadRequestError("Email is already taken");

    const user = User.build({ email, password });

    await user.save();

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

    res.status(201).json(user);
  }
);

export { router as signupRouter };
