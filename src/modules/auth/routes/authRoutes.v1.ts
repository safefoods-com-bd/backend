import { RequestHandler, Router } from "express";
import { register } from "@/modules/auth/controllers/v1/traditional/registerController";
import { verifyOnRegister } from "@/modules/auth/controllers/v1/traditional/verifyOnRegisterController";
import { login } from "@/modules/auth/controllers/v1/traditional/loginController";
import { refreshTokenRequest } from "@/modules/auth/controllers/refreshTokenController";
import { forgotPasswordV100 } from "@/modules/auth/controllers/v1/traditional/reset-password/forgotPassword.controller";
import { resetPassword } from "@/modules/auth/controllers/v1/traditional/reset-password/resetPassword.controller";
import { googleSignIn } from "@/modules/auth/controllers/v1/traditional/googleSigninController";
import {
  rateLimitingOnIndividualIp,
  rateLimitingOnIndividualUserAndIp,
} from "@/middleware/rateLimiting";
import { logout } from "@/modules/auth/controllers/v1/traditional/logout";
import { sendMobileOtpControllerV100 } from "@/modules/auth/controllers/v1/mobile-otp/sendMobileOtp.controller";
import { verifyMobileOtpV100 } from "@/modules/auth/controllers/v1/mobile-otp/verifyMobileOtp.controller";
import { forgotPasswordOtpVerification } from "@/modules/auth/controllers/v1/traditional/reset-password/forgotPasswordEmailVerification.controller";

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
    forgotPasswordV100(req, res);
  },
);

router.post("/forgot-password-otp-verification", (req, res) => {
  forgotPasswordOtpVerification(req, res);
});

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
