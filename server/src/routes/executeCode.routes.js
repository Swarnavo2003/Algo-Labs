import {Router} from "express";
import {isAuthenticated} from "../middlewares/auth.middleware.js";
import {executeCode} from "../controllers/executeCode.controller.js";

const executeCodeRouter = Router();

executeCodeRouter.post("/", isAuthenticated, executeCode);

export default executeCodeRouter;
