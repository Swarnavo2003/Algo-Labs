import jwt from "jsonwebtoken";

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (user: UserPayload) => {
  return jwt.sign(user, process.env.JWT_SECRET as string);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
