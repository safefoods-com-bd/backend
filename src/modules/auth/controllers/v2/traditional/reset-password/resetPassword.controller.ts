import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { verifyOnResetPasswordSchema } from "../../../../authValidations";

import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { handleError } from "@/utils/errorHandler";
import { validateZodSchema } from "@/middleware/validationMiddleware";
import { decryptTokenData } from "@/lib/authFunctions";

export const resetPasswordV200 = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = await validateZodSchema(
      verifyOnResetPasswordSchema,
    )(req.body);

    // verify the token and code
    const forgot_password_token = req.headers.forgot_password_token;
    if (!forgot_password_token) {
      return res.status(400).json({
        success: false,
        message: " Token is missing.",
      });
    }

    const tokenData = await decryptTokenData(forgot_password_token as string);

    if (tokenData.success === false) {
      return res.status(400).json({
        success: false,
        message: tokenData.message,
      });
    }
    const emailFromToken = tokenData.data.email;

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

    return res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    // console.log(error);
    handleError(error, res);
  }
};
