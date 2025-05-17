import { Router } from "express";
import { getMe, login, logout, register } from "../controllers/auth.controllers.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/get-me").get(getMe);

export default router;