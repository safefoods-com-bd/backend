import {
  OTP_VERIFICATION_TOKEN_AGE,
  REFRESH_TOKEN_AGE,
} from "@/constants/variables";
import { encrypt } from "@/lib/authFunctions";
import axios from "axios";
import { Request, Response } from "express";

export const sendMobileOtpController = async (req: Request, res: Response) => {
  try {
    const { mobileNumber } = req.body;

    // Validate mobile number format
    if (!/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({ error: "Invalid mobile number format" });
    }

    // Simulate sending OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    console.log(`OTP sent to ${mobileNumber}: ${otp}`); // Replace with actual sending logic

    const token = await encrypt(
      {
        mobileNumber,
        otp,
      },
      OTP_VERIFICATION_TOKEN_AGE,
    );

    const greenwebsms = new URLSearchParams();
    greenwebsms.append(
      "token",
      "11366213142172675990283780b925db54e5ae6eff6d55d95a4ec",
    );
    greenwebsms.append("to", mobileNumber);
    greenwebsms.append("message", `আপনার লগইন OTP: ${otp}`);
    const response = await axios.post(
      "http://api.greenweb.com.bd/api.php",
      greenwebsms,
    );

    if (response.data.includes("Ok")) {
      return res.status(200).json({
        message: "OTP sent successfully",
        otp,
        token,
        mobileNumber,
        success: true,
      });
    } else if (response.data.includes("Invalid")) {
      return res.status(400).json({ error: "Invalid mobile number" });
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
