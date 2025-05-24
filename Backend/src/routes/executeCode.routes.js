import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controllers.js";

const router = Router();

router.route("/").post(authMiddleware, executeCode)

export default router;