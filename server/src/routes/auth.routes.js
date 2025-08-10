import {Router} from "express";
import {validateZod} from "../middlewares/zod.middleware.js";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../validations/auth.validations.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";
import {isAuthenticated} from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", validateZod(userRegistrationSchema), registerUser);
authRouter.post("/login", validateZod(userLoginSchema), loginUser);
authRouter.get("/logout", isAuthenticated, logoutUser);
authRouter.get("/current-user", isAuthenticated, getCurrentUser);

export default authRouter;
