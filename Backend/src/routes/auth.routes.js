import { Router } from "express";
import { check, login, logout, register } from "../controllers/auth.controllers.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/check").get(check);

export default router;