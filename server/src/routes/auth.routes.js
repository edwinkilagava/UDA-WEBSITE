
import express from "express";
import rateLimit from "express-rate-limit";

import {
  registerController,
  loginController,
  googleLoginController,
  currentUserController,
  logoutController,
} from "../controllers/auth.controller.js";

import authenticate from "../middleware/authenticate.middleware.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

router.post("/register", authRateLimit, registerController);
router.post("/login", authRateLimit, loginController);

// Firebase ID token is verified before the controller runs.
router.post(
  "/google",
  authRateLimit,
  verifyFirebaseToken,
  googleLoginController
);

router.get("/me", authenticate, currentUserController);
router.post("/logout", logoutController);

export default router;
