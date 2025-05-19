import { NextFunction, Request, Response } from "express";
import userService from "../services/UserService";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../helpers";
import { User } from "../models/User";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  const token = header?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!jwtSecret) {
    return res.status(500).json({ message: "Internal server error" });
  }

  const decoded = jwt.verify(token, jwtSecret) as Partial<User>;
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await userService.findUserById(decoded._id as unknown as string);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = user;
  next();
};

export default authMiddleware;
