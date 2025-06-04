import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
} from "../controllers/problem.controller";

const problemRouter = Router();

problemRouter.post("/create-problem", isAuthenticated, isAdmin, createProblem);

problemRouter.get("/get-all-problems", isAuthenticated, getAllProblems);

problemRouter.get("/get-problem/:id", isAuthenticated, getProblemById);

problemRouter.put(
  "/update-problem/:id",
  isAuthenticated,
  isAdmin,
  updateProblem
);

problemRouter.delete(
  "/delete-problem/:id",
  isAuthenticated,
  isAdmin,
  deleteProblem
);

export default problemRouter;
