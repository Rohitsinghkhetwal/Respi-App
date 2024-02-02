import { Router } from "express";
import {
    DeleteVedio,
  PublishVedio,
  getAllVedio,
  getVedioById,
  updateVedio,
} from "../controller/vedios.controller.js";
import { verifyJwt } from "../Middleware/Auth.middleware.js";
import { upload } from "../Middleware/multer.middleware.js";

const router = Router();
router.route("/publishVedio").post( 
    upload.fields([
        {
            name: "vedioFile",
            maxCount: 1

        }, 
        {
            name: "thumbnail",
            maxCount: 1

        }

    ]),  
    PublishVedio);

router.route("/vedios/:_id").get(getVedioById);
router.route("/updateVedio/:_id").patch(updateVedio);
router.route("/getall").get(getAllVedio);
router.route("/deleteVedio/:_id").delete(DeleteVedio);

export default router;