import { Router } from "express";
import {verifyJwt} from "../Middleware/Auth.middleware.js"
import { toggleVedioLike } from "../controller/like.controller.js";

const router = Router();
router.route("/toggleLike/:vedioId").post(verifyJwt, toggleVedioLike);
export default router;