import { Router } from "express";
import { getMe, login, logout, register } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(authMiddleware, logout);
router.route("/get-me").get(authMiddleware, getMe);

export default router;