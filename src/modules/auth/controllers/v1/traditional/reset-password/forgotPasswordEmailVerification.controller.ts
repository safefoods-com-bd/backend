import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { verifyForgotPasswordOtpVerificationSchema } from "../../../../authValidations";

import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { handleError } from "@/utils/errorHandler";
import { validateZodSchema } from "@/middleware/validationMiddleware";
import { decryptTokenData } from "@/lib/authFunctions";

export const forgotPasswordOtpVerification = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email, otp } = await validateZodSchema(
      verifyForgotPasswordOtpVerificationSchema,
    )(req.body);
    const { email_verification_token } = req.cookies;
    if (!email_verification_token) {
      return res.status(400).json({
        success: false,
        message: "Email verification token is missing",
      });
    }
    // verify the token and otp
    const tokenData = await decryptTokenData(email_verification_token);

    if (tokenData.success === false) {
      return res.status(400).json({
        success: false,
        message: tokenData.message,
      });
    }
    const emailFromToken = tokenData.data.email;
    const otpFromToken = tokenData.data.otp;

    if (email !== emailFromToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    // Check if user with this email exists
    const userExists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, emailFromToken));

    // Check if user exists
    if (userExists.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No user found with this email.",
      });
    }

    // If otp is invalid, return error
    if (+otp !== +otpFromToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid otp submitted.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Otp verified successfully.",
    });
  } catch (error) {
    // console.log(error);
    handleError(error, res);
  }
};
