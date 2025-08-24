import {Router} from "express";
import {isAdmin, isAuthenticated} from "../middlewares/auth.middleware.js";
import {validateZod} from "../middlewares/zod.middleware.js";
import {problemCreationSchema} from "../validations/problem.validations.js";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
} from "../controllers/problem.controller.js";

const problemRouter = Router();

problemRouter.post(
  "/create-problem",
  isAuthenticated,
  isAdmin,
  // validateZod(problemCreationSchema),
  createProblem,
);

problemRouter.get("/get-all-problems", isAuthenticated, getAllProblems);
problemRouter.get("/get-problem/:id", isAuthenticated, getProblemById);
problemRouter.put(
  "/update-problem/:id",
  isAuthenticated,
  isAdmin,
  updateProblem,
);
problemRouter.delete(
  "/delete-problem/:id",
  isAuthenticated,
  isAdmin,
  deleteProblem,
);

export default problemRouter;
