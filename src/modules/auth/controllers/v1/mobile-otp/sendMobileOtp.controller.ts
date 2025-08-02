import {
  EMAIL_VERIFICATION_COOKIE_MAX_AGE,
  isProduction,
  OTP_VERIFICATION_TOKEN_AGE,
  OTP_VERIFICATION_TOKEN_NAME,
} from "@/constants/variables";
import { AUTH_ENDPOINTS } from "@/data/endpoints";
import { encrypt } from "@/lib/authFunctions";
import { handleError } from "@/utils/errorHandler";
import axios from "axios";
import { Request, Response } from "express";

export const sendMobileOtpControllerV100 = async (
  req: Request,
  res: Response,
) => {
  try {
    const { phoneNumber } = req.body;

    // Simulate sending OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    const token = await encrypt(
      {
        phoneNumber,
        otp,
      },
      OTP_VERIFICATION_TOKEN_AGE,
    );

    const greenwebsms = new URLSearchParams();
    greenwebsms.append(
      "token",
      "96220949491686887389228ffc24f27e5b6ad7592542e365b212",
    );
    greenwebsms.append("to", phoneNumber);
    greenwebsms.append("message", `আপনার লগইন OTP: ${otp}`);
    const response = await axios.post(
      "http://api.greenweb.com.bd/api.php",
      greenwebsms,
    );

    if (response.data.includes("Ok")) {
      res.cookie(OTP_VERIFICATION_TOKEN_NAME, token, {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax", // "none" for production, "lax" for development
        secure: isProduction, // true for production, false for development
        maxAge: EMAIL_VERIFICATION_COOKIE_MAX_AGE, // 1 hour
      });
      return res.status(200).json({
        message: "OTP sent successfully",
        success: true,
      });
    } else if (response.data.includes("Invalid")) {
      return res.status(400).json({ error: "Invalid mobile number" });
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  } catch (error) {
    handleError(error, res, AUTH_ENDPOINTS.SEND_MOBILE_OTP);
  }
};
