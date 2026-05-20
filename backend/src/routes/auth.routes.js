import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    verifyEmail,
    resendVerification,
    forgotPassword,
    verifyOtp,
    resetPassword,
    oauthLogin
} from "../controllers/auth.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const router = Router();

// Public routes

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(verifyJwt, logoutUser);

// Email verification routes
router.route("/verify-email/:token").get(verifyEmail);
router.route("/resend-verification").post(resendVerification);

// Password reset routes (OTP-based)
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-otp").post(verifyOtp);
router.route("/reset-password").post(resetPassword);

// OAuth login
router.route("/oauth").post(oauthLogin);

export default router;