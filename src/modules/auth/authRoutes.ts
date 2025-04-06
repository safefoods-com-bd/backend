import { Router } from "express";
import { register } from "./controllers/registerController";
import { verifyOnRegister } from "./controllers/verifyOnRegisterController";
import { login } from "./controllers/loginController";
import { refreshTokenRequest } from "./controllers/refreshTokenController";
import { forgotPassword } from "./controllers/forgotPassword";
import { resetPassword } from "./controllers/resetPassword";
import { googleSignIn } from "./controllers/googleSigninController";
import {
  rateLimitingOnIndividualIp,
  rateLimitingOnIndividualUserAndIp,
} from "@/middleware/rateLimiting";
import { logout } from "./controllers/logout";

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

export default router;
