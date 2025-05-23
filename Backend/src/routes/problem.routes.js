import { Router } from "express";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblem } from "../controllers/problem.controllers.js";

const router = Router();

router.route("/create-problem").post(authMiddleware, isAdmin, createProblem);
router.route("/get-all-problems").get(authMiddleware, getAllProblems);
router.route(("/get-problem/:id")).get(authMiddleware, getProblemById);
router.route("/update-problem/:id").put(authMiddleware, isAdmin, updateProblem);
router.route("/delete-problem/:id").delete(authMiddleware, isAdmin, deleteProblem);
router.route("/get-solved-problems").get(authMiddleware, getAllProblemsSolvedByUser);

export default router;