import { Request, Response } from "express";
import User, { IUser } from "../../models/User";

export default async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find({}, "username email role");

    if (users.length > 0) {
      res.json({
        status: "ok",
        message: "Users retrieved successfully",
        users: users,
      });
    } else {
      res.json({
        status: "ok",
        message: "No users found",
        users: [],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
