import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  const secret = "Fullstack-Login-2023";

  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "Authorization token missing" });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    next();
  } catch (error) {
    return res.status(401).json({ status: "error", message: "Invalid token" });
  }
};
