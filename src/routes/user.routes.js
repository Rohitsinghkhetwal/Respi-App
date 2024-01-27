import { Router } from "express";
import {
  LoginUser,
  LogoutUser,
  registerUser,
  refreshJwtToken,
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
router.route("/refresh-token").post(refreshJwtToken
  );
export default router;
