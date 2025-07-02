import { Router } from "express";
import { getAllProblemsSolvedByUser, getGoogleLoginCallback, getMe, login, loginWithGoogle, logout, register } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(authMiddleware, logout);
router.route("/get-me").get(authMiddleware, getMe);
router.route("/get-solved-problems").get(authMiddleware, getAllProblemsSolvedByUser);
router.route("/google").get(loginWithGoogle);
router.route("/google/callback").get(getGoogleLoginCallback);

export default router;