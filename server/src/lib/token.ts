import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (user: UserPayload) => {
  return jwt.sign(user, env.JWT_SECRET);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};
