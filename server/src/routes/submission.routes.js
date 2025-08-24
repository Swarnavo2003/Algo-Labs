import {Router} from "express";
import {isAuthenticated} from "../middlewares/auth.middleware.js";
import {
  getAllSubmissions,
  getAllSubmissionsForProblem,
  getSubmissionForProblem,
} from "../controllers/submission.controller.js";

const submissionRouter = Router();

submissionRouter.get("/get-all-submission", isAuthenticated, getAllSubmissions);

submissionRouter.get(
  "/get-submission/:id",
  isAuthenticated,
  getSubmissionForProblem,
);

submissionRouter.get(
  "/get-submission-count/:id",
  isAuthenticated,
  getAllSubmissionsForProblem,
);

export default submissionRouter;
