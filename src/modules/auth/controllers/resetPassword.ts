import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { verifyOnResetPasswordSchema } from "../authValidations";

import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { handleError } from "@/utils/errorHandler";
import { validateZodSchema } from "@/middleware/validationMiddleware";
import { decryptTokenData } from "@/lib/authFunctions";
import { ACCESS_TOKEN_NAME } from "@/constants/variables";

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, token, password, confirmPassword } =
      await validateZodSchema(verifyOnResetPasswordSchema)(req.body);

    // verify the token and code
    const tokenData = await decryptTokenData(token);

    if (tokenData.success === false) {
      return res.status(400).json({
        success: false,
        message: tokenData.message,
      });
    }
    const emailFromToken = tokenData.data.email;
    const codeFromToken = tokenData.data.code;

    if (email !== emailFromToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    // If code is invalid, return error
    if (+code !== +codeFromToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid code",
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

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    if (userExists.length > 0 && userExists[0].isVerified) {
      await db
        .update(usersTable)
        .set({ password: hashedPassword })
        .where(eq(usersTable.email, emailFromToken));
    }
    // Clear the cookie after password reset
    res.clearCookie(ACCESS_TOKEN_NAME);

    return res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    // console.log(error);
    handleError(error, res);
  }
};
