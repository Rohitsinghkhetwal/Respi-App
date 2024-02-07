import { Router } from "express";
import { AddVedioToPlaylist, createPlaylist } from "../controller/playlist.controller.js";
import { verifyJwt } from "../Middleware/Auth.middleware.js";

const router = Router();
router.route("/createPlaylist").post(verifyJwt, createPlaylist);
router.route("/add/:vedioId/:playlistId").patch(verifyJwt, AddVedioToPlaylist);


export default router;

