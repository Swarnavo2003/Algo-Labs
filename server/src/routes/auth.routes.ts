import { Router } from "express";
import { validateZod } from "../middlewares/zod.middleware";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../validations/auth.validations";
import { isAuthenticated } from "../middlewares/auth.middleware";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", validateZod(userRegistrationSchema), registerUser);
authRouter.post("/login", validateZod(userLoginSchema), loginUser);
authRouter.get("/logout", isAuthenticated, logoutUser);
authRouter.get("/current-user", isAuthenticated, getCurrentUser);

export default authRouter;
