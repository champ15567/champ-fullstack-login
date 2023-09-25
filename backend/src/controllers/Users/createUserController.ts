import { Request, Response } from "express";
import User, { IUser } from "../../models/User";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.create(req.body as IUser);
    const secret = "Fullstack-Login-2023";
    const token = jwt.sign({ username: req.body.username }, secret, {
      expiresIn: "1h",
    });
    res.json({
      status: "ok",
      message: "User Created Successfully",
      token,
      profile: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error) {
      const validationErrors = Object.keys(error.errors).map(
        (key) => error.errors[key].message
      );
      res.status(400).json({ status: "error", message: validationErrors });
    }
  }
};
