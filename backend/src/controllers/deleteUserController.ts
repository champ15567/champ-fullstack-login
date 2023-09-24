import { Request, Response } from "express";
import User, { IUser } from "../models/User";

export default async (req: Request, res: Response) => {
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

    await User.findByIdAndDelete(user._id);

    res.json({
      status: "ok",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
