import dotenv from "dotenv";
dotenv.config();

interface Env {
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
}

export const env: Env = {
  PORT: (process.env.PORT as unknown as number) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
};
