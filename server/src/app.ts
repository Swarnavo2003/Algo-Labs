import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import healthCheckRouter from "./routes/healthCheck.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    exposedHeaders: ["set-cookie", "*"],
  })
);

app.use("/api/v1/health-check", healthCheckRouter);

export default app;
