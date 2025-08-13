import {Router} from "express";
import {isAuthenticated} from "../middlewares/auth.middleware.js";
import {executeCode, runCode} from "../controllers/executeCode.controller.js";

const executeCodeRouter = Router();

executeCodeRouter.post("/run", isAuthenticated, runCode);
executeCodeRouter.post("/", isAuthenticated, executeCode);

export default executeCodeRouter;
