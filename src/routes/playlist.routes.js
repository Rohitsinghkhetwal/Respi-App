import { Router } from "express";
import { AddVedioToPlaylist, createPlaylist, getUserPlaylists } from "../controller/playlist.controller.js";
import { verifyJwt } from "../Middleware/Auth.middleware.js";

const router = Router();
router.route("/createPlaylist").post(verifyJwt, createPlaylist);
router.route("/add/:vedioId/:playlistId").patch(verifyJwt, AddVedioToPlaylist);
router.route("/getUserPlaylist/:userID").get(verifyJwt, getUserPlaylists)


export default router;

