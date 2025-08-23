import { FORGOT_PASSWORD_TOKEN_AGE, isProduction } from "@/constants/variables";
import { onResetPasswordVerificationEmail } from "@/data/emails/authEmailContents";
import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import {
  decryptTokenData,
  encrypt,
  generateRandomCode,
} from "@/lib/authFunctions";
import {
  sendEmailUsingMailhog,
  sendEmailWithNodemailer,
} from "@/services/emails";
import { handleError } from "@/utils/errorHandler";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

export const resendOtpOnForgotPasswordV200 = async (
  req: Request,
  res: Response,
) => {
  try {
    const forgot_password_token = req.headers["forgot-password-token"];
    if (!forgot_password_token) {
      return res.status(400).json({
        success: false,
        message: "Token is missing",
      });
    }
    // verify the token

    const tokenData = await decryptTokenData(forgot_password_token as string);
    if (tokenData.success === false) {
      return res.status(400).json({
        success: false,
        message: tokenData.message,
      });
    }
    const email = tokenData.data.email;
    // Check if user with this email already exists
    const userExists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    // If user does not exist, return error
    if (userExists.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email does not exist",
      });
    }
    // If user exists and is verified, return error
    if (!userExists[0].isVerified) {
      return res.status(400).json({
        success: false,
        message: "User with this email is not verified",
      });
    }

    const otp = generateRandomCode();

    const token = await encrypt(
      {
        email,
        otp,
      },
      FORGOT_PASSWORD_TOKEN_AGE,
    );
    const emailData = {
      from: `${process.env.EMAIL_USER}`,
      to: email,
      subject: "Email Verification",
      html: onResetPasswordVerificationEmail({ email: email, otp }),
    };

    if (isProduction) {
      sendEmailWithNodemailer(emailData);
    } else {
      sendEmailUsingMailhog(emailData);
    }

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      token: token,
      otp: isProduction ? undefined : otp, // Do not send OTP in production
    });
  } catch (error) {
    handleError(error, res);
  }
};
