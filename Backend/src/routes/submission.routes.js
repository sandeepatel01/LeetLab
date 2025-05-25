import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getAllSubmission, getAllTheSubmissionsForProblem, getSubmissionsForProblem } from "../controllers/submission.controllers.js";

const router = Router();

router.route("/get-all-submissions").get(authMiddleware, getAllSubmission);
router.route("/get-submission/:problemId").get(authMiddleware, getSubmissionsForProblem);
router.route("/get-submissions-count/:problemId").get(authMiddleware, getAllTheSubmissionsForProblem);

export default router;