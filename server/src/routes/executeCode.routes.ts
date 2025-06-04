import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { executeCode } from "../controllers/executeCode.controller";

const executeCodeRouter = Router();

executeCodeRouter.post("/", isAuthenticated, executeCode);

export default executeCodeRouter;
