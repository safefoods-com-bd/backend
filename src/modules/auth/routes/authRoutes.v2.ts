import { RequestHandler, Router } from "express";

import { googleSignIn } from "@/modules/auth/controllers/v1/traditional/googleSigninController";
import { rateLimitingOnIndividualIp } from "@/middleware/rateLimiting";
import { logout } from "@/modules/auth/controllers/v1/traditional/logout";
import { registerV200 } from "../controllers/v2/traditional/registerController";
import { verifyOnRegisterV200 } from "../controllers/v2/traditional/verifyOnRegisterController";
import { loginV200 } from "../controllers/v2/traditional/loginController";
import { forgotPasswordV200 } from "../controllers/v2/traditional/reset-password/forgotPassword.controller";
import { forgotPasswordOtpVerificationV200 } from "../controllers/v2/traditional/reset-password/forgotPasswordEmailVerification.controller";
import { resetPasswordV200 } from "../controllers/v2/traditional/reset-password/resetPassword.controller";
import { sendMobileOtpControllerV200 } from "../controllers/v2/mobile-otp/sendMobileOtp.controller";
import { verifyMobileOtp200 } from "../controllers/v2/mobile-otp/verifyMobileOtp.controller";
import { resendOtpOnRegisterV200 } from "../controllers/v2/traditional/resendRegisterOtp.controller";
import { resendOtpOnForgotPasswordV200 } from "../controllers/v2/traditional/reset-password/resendForgotPasswordOtp.controller";

const router = Router();
router.post(
  "/register",
  rateLimitingOnIndividualIp({ time: 10, maxRequests: 5 }),
  registerV200 as RequestHandler,
);

router.get(
  "/resend-register-otp",
  rateLimitingOnIndividualIp({ time: 10, maxRequests: 5 }),
  resendOtpOnRegisterV200 as RequestHandler,
);

router.post("/email-verification", verifyOnRegisterV200 as RequestHandler);

router.post(
  "/login",
  rateLimitingOnIndividualIp({ time: 30, maxRequests: 5 }),
  loginV200 as RequestHandler,
);

router.post(
  "/forgot-password",
  rateLimitingOnIndividualIp({ time: 10, maxRequests: 5 }),
  forgotPasswordV200 as RequestHandler,
);

router.get(
  "/resend-forgot-password-otp",
  resendOtpOnForgotPasswordV200 as RequestHandler,
);

router.post(
  "/forgot-password-otp-verification",
  forgotPasswordOtpVerificationV200 as RequestHandler,
);

router.post("/reset-password", resetPasswordV200 as RequestHandler);

router.post("/logout", logout as RequestHandler);

router.get("/google", googleSignIn as RequestHandler);

// Mobile OTP routes
router.post("/send-mobile-otp", sendMobileOtpControllerV200 as RequestHandler);
router.post("/verify-mobile-otp", verifyMobileOtp200 as RequestHandler);

export default router;
