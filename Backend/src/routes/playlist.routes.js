import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlayListDetails, removeProblemFromPlaylist } from "../controllers/playlist.controllers.js";

const router = Router();

router.route("/create-playlist").post(authMiddleware, createPlaylist);
router.route("/").get(authMiddleware, getAllListDetails);
router.route("/:playlistId").get(authMiddleware, getPlayListDetails);
router.route("/:playlistId/add-problem").post(authMiddleware, addProblemToPlaylist);
router.route("/:playlistId/remove-problem").post(authMiddleware, removeProblemFromPlaylist);
router.route("/:playlistId").delete(authMiddleware, deletePlaylist);

export default router;