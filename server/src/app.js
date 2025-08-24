import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import healthCheckRouter from "./routes/healthCheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import {errorHandler} from "./utils/error-handler.js";
import problemRouter from "./routes/problem.routes.js";
import executeCodeRouter from "./routes/executeCode.routes.js";
import submissionRouter from "./routes/submission.routes.js";
import playlistRouter from "./routes/playlist.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    exposedHeaders: ["set-cookie", "*"],
  }),
);

app.use("/api/v1/health-check", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/execute-code", executeCodeRouter);
app.use("/api/v1/submission", submissionRouter);
app.use("/api/v1/playlist", playlistRouter);

app.use(errorHandler);

export default app;
