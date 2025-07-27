import { RequestHandler, Router } from "express";
import { register } from "./controllers/traditional/registerController";
import { verifyOnRegister } from "./controllers/traditional/verifyOnRegisterController";
import { login } from "./controllers/traditional/loginController";
import { refreshTokenRequest } from "./controllers/refreshTokenController";
import { forgotPassword } from "./controllers/traditional/forgotPassword";
import { resetPassword } from "./controllers/traditional/resetPassword";
import { googleSignIn } from "./controllers/traditional/googleSigninController";
import {
  rateLimitingOnIndividualIp,
  rateLimitingOnIndividualUserAndIp,
} from "@/middleware/rateLimiting";
import { logout } from "./controllers/traditional/logout";
import { sendMobileOtpControllerV100 } from "./controllers/mobile-otp/sendMobileOtp.controller";
import { verifyMobileOtpV100 } from "./controllers/mobile-otp/verifyMobileOtp.controller";

const router = Router();
router.post(
  "/register",
  rateLimitingOnIndividualIp({ time: 10, maxRequests: 5 }),
  (req, res) => {
    register(req, res);
  },
);

router.post("/email-verification", (req, res) => {
  verifyOnRegister(req, res);
});

router.post(
  "/login",
  rateLimitingOnIndividualIp({ time: 30, maxRequests: 5 }),
  (req, res) => {
    login(req, res);
  },
);

router.post(
  "/forgot-password",
  rateLimitingOnIndividualIp({ time: 10, maxRequests: 5 }),
  (req, res) => {
    forgotPassword(req, res);
  },
);

router.post(
  "/reset-password",

  (req, res) => {
    resetPassword(req, res);
  },
);

router.get(
  "/refresh-token",
  rateLimitingOnIndividualUserAndIp({ time: 20, maxRequests: 5 }),
  (req, res) => {
    refreshTokenRequest(req, res);
  },
);

router.post("/logout", (req, res) => {
  logout(req, res);
});

router.get("/google", (req, res) => {
  googleSignIn(req, res);
});

// Mobile OTP routes
router.post("/send-mobile-otp", sendMobileOtpControllerV100 as RequestHandler);
router.post("/verify-mobile-otp", verifyMobileOtpV100 as RequestHandler);

export default router;
