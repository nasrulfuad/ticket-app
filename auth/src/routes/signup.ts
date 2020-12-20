import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { BadRequestError, RequestValidationError } from "../errors";
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
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

    const userExists = await User.findOne({ email });

    if (userExists) throw new BadRequestError("Email is already taken");

    const user = User.build({ email, password });

    await user.save();

    res.status(201).json(user);
  }
);

export { router as signupRouter };
