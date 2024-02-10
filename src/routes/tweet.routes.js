import { Router } from "express";
import { DeleteTweets, createTweet, getUsersTweet, updateTweet } from "../controller/tweet.controller.js";
import {verifyJwt} from "../Middleware/Auth.middleware.js"

const router = Router();

router.route("/createTweet").post(verifyJwt, createTweet);
router.route("/getTweets").get(verifyJwt, getUsersTweet);
router.route("/updateTweet/:tweetId").patch(verifyJwt, updateTweet);
router.route("/deleteTweet/:tweetId").delete(verifyJwt, DeleteTweets);


export default router;

