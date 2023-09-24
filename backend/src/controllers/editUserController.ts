import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username: string = req.params.username;

    if (!username) {
      return res
        .status(400)
        .json({ status: "error", message: "Username is required" });
    }

    const user: IUser | null = await User.findOne({ username: username });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const updateFields: Partial<IUser> = {};

    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "At least one field is required" });
    }

    if (req.body.email) {
      updateFields.email = req.body.email;
    }

    if (
      req.body.role &&
      (req.body.role === "admin" || req.body.role === "user")
    ) {
      updateFields.role = req.body.role;
    }

    if (req.body.password) {
      try {
        const hash = await bcrypt.hash(req.body.password, 10);
        updateFields.password = hash;
      } catch (error) {
        console.error(error);
        next(new Error("Password hashing failed"));
      }
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(user._id, updateFields, {
        new: true,
      });

      if (!updatedUser) {
        return res
          .status(500)
          .json({ status: "error", message: "User update failed" });
      }

      res.json({
        status: "ok",
        message: "User updated successfully",
        user: {
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    } catch (updateError) {
      console.error(updateError);
      return res
        .status(500)
        .json({ status: "error", message: "User update failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
