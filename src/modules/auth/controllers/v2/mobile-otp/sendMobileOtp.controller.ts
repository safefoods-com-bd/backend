import {
  isProduction,
  OTP_VERIFICATION_TOKEN_AGE,
} from "@/constants/variables";
import { AUTH_ENDPOINTS } from "@/data/endpoints";
import { encrypt } from "@/lib/authFunctions";
import { handleError } from "@/utils/errorHandler";
import axios from "axios";
import { Request, Response } from "express";

export const sendMobileOtpControllerV200 = async (
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
      return res.status(200).json({
        message: "OTP sent successfully",
        token: token,
        otp: isProduction ? otp : undefined,
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
