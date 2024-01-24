import { Router } from "express";
import { LoginUser, LogoutUser, registerUser } from "../controller/user.controller.js";
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
router.route("/logout").post(verifyJwt, LogoutUser);
export default router;
