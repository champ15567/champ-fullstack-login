import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../../models/User";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user: IUser | null = await User.findOne({ username: username });

    if (user) {
      const match: boolean = await bcrypt.compare(password, user.password);

      if (match) {
        const secret = "Fullstack-Login-2023";
        const token = jwt.sign({ username: username }, secret, {
          expiresIn: "1h",
        });

        res.json({
          status: "ok",
          message: "Login Successfully",
          token,
          profile: {
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      } else {
        res.json({
          status: "error",
          message: "Invalid Username or Password",
        });
      }
    } else {
      res.json({ status: "error", message: "Invalid Username or Password" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
