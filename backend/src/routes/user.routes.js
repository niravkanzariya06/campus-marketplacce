import { Router } from "express";
import {
    getCurrentUser,
    updateProfile,
    changeAvatar,
    changePassword,
    deleteAccount
} from "../controllers/user.controllers.js";


import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();



// Protected routes
router.route("/me").get(verifyJwt, getCurrentUser);
router.route("/profile").patch(verifyJwt, updateProfile);
router.route("/change-avatar").patch(
    verifyJwt,
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    changeAvatar
);
router.route("/change-password").patch(verifyJwt, changePassword);
router.route("/delete-account").delete(verifyJwt, deleteAccount);

export default router;

