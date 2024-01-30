import { Router } from "express";
import {
  LoginUser,
  LogoutUser,
  registerUser,
  refreshJwtToken,
  changePassword,
  updateAccountDetail,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controller/user.controller.js";
import { upload } from "../Middleware/multer.middleware.js";
import { verifyJwt } from "../Middleware/Auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(LoginUser);
//secure routes
router.route("/logout").post(verifyJwt, LogoutUser);
router.route("/refresh-token").post(refreshJwtToken);
router.route("/change-password").post(verifyJwt, changePassword);
router.route("update-accountDetails").patch(verifyJwt, updateAccountDetail);
router.route("/update-avatar").patch(verifyJwt,upload.single("avatar"), updateAvatar);
router.route("/update-coverImage").patch(verifyJwt, upload.single("CoverImage"), updateCoverImage);
router.route("/channel/:username").get(verifyJwt, getUserChannelProfile);
router.route("/getWatchHistory").get(verifyJwt, getWatchHistory);
export default router;
