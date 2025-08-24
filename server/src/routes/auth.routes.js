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
  updateUser,
} from "../controllers/auth.controller.js";
import {isAuthenticated} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js";

const authRouter = Router();

authRouter.post("/register", validateZod(userRegistrationSchema), registerUser);
authRouter.post("/login", validateZod(userLoginSchema), loginUser);
authRouter.get("/logout", isAuthenticated, logoutUser);
authRouter.get("/current-user", isAuthenticated, getCurrentUser);
authRouter.put(
  "/update-user",
  isAuthenticated,
  upload.fields([{name: "avatar", maxCount: 1}]),
  updateUser,
);

export default authRouter;
