import {Router} from "express";
import {addComment, deleteComment, getVediosComment, updateComment} from "../controller/Comment.controller.js";
import {verifyJwt} from "../Middleware/Auth.middleware.js";

const router = Router();
router.route("/getVidsComment").post(verifyJwt, getVediosComment);
router.route("/addVComment/:vedioId").post(verifyJwt, addComment);
router.route("/updateComment/:commentId").patch(verifyJwt, updateComment);
router.route("deleteComment/:commentId").delete(verifyJwt, deleteComment);

export default router;
