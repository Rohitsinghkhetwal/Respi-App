import {Router} from "express";
import {getVediosComment} from "../controller/Comment.controller.js";
import {verifyJwt} from "../Middleware/Auth.middleware.js";

const router = Router();
router.route("/addComment").post(verifyJwt, getVediosComment);

export default router;
