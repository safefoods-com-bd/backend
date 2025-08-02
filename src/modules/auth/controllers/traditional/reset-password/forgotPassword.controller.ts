import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { forgotPasswordSchema } from "../../../authValidations";

import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { handleError } from "@/utils/errorHandler";
import { encrypt, generateRandomCode } from "@/lib/authFunctions";
import { validateZodSchema } from "@/middleware/validationMiddleware";
import { onResetPasswordVerificationEmail } from "@/data/emails/authEmailContents";
import {
  sendEmailUsingMailhog,
  sendEmailWithNodemailer,
} from "@/services/emails";
import {
  isProduction,
  EMAIL_VERIFICATION_TOKEN_NAME,
  EMAIL_VERIFICATION_COOKIE_MAX_AGE,
  EMAIL_VERIFICATION_TOKEN_AGE,
} from "@/constants/variables";

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = await validateZodSchema(forgotPasswordSchema)(req.body);

    // Check if user with this email exists
    const userExists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    // Check if user exists
    if (userExists.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No user found with this email.",
      });
    }

    // Check if user's email is verified
    if (!userExists[0].isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please Register First.",
      });
    }

    // sending verification email
    const otp = generateRandomCode();

    const token = await encrypt(
      {
        email,
        otp,
      },
      EMAIL_VERIFICATION_TOKEN_AGE,
    );

    const emailData = {
      from: `${process.env.EMAIL_USER}`,
      to: email,
      subject: "Reset Password Verification otp",
      html: onResetPasswordVerificationEmail({ email: email, otp: otp }),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isProduction
      ? sendEmailWithNodemailer(emailData)
      : sendEmailUsingMailhog(emailData);
    //todo : HEATOS links

    //set the session token
    res.cookie(EMAIL_VERIFICATION_TOKEN_NAME, token, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax", // "none" for production, "lax" for development
      secure: isProduction, // true for production, false for development
      maxAge: EMAIL_VERIFICATION_COOKIE_MAX_AGE, // 1 minute
    });

    return res.status(200).json({
      success: true,
      message: "Reset Password verification otp sent to your email",
      otp: isProduction ? undefined : otp,
    });
  } catch (error) {
    // console.log(error);
    handleError(error, res);
  }
};
