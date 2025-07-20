import { validateZodSchema } from "@/middleware/validationMiddleware";
import { registerUserSchema } from "../../authValidations";
import { rolesTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { Request, Response } from "express";
import { encrypt, generateRandomCode } from "@/lib/authFunctions";
import {
  sendEmailUsingMailhog,
  sendEmailWithNodemailer,
} from "@/services/emails";
import { onRegisterVerificationEmail } from "@/data/emails/authEmailContents";
import { handleError } from "@/utils/errorHandler";

import { hash } from "bcryptjs";
import { DEFAULT_ROLE } from "@/constants/permissionsAndRoles";
import {
  isProduction,
  ACCESS_TOKEN_NAME,
  ACCESS_TOKEN_AGE,
  ACCESS_TOKEN_COOKIE_MAX_AGE,
} from "@/constants/variables";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = await validateZodSchema(
      registerUserSchema,
    )(req.body);
    // Delete the user if it exists in the database
    if (!isProduction) {
      await db
        .delete(usersTable)
        .where(eq(usersTable.email, "alarafatsiddique@softeko.co"));
    }

    // Check if user with this email already exists
    const userExists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    // If user exists and is verified, return error
    if (userExists.length > 0 && userExists[0].isVerified) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
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
    // If user exists but is not verified, update the user
    if (userExists.length === 0) {
      // Insert the user into the database
      // Get the default role
      const getDefaultRole = await db
        .select()
        .from(rolesTable)
        .where(eq(rolesTable.name, DEFAULT_ROLE));
      if (getDefaultRole.length === 0) {
        return res.status(500).json({
          success: false,
          message: "No role found in the database. Not possible to register",
        });
      }
      await db.insert(usersTable).values({
        email: email,
        password: hashedPassword,
        roleId: getDefaultRole[0].id,
        isDeleted: false,
        isVerified: false,
      });
    }

    // If user exists but is not verified, update the user
    if (userExists.length > 0 && !userExists[0].isVerified) {
      await db
        .update(usersTable)
        .set({ password: hashedPassword })
        .where(eq(usersTable.email, email));
    }
    // sending verification email
    const code = generateRandomCode();

    const token = await encrypt(
      {
        email,
        code,
      },
      ACCESS_TOKEN_AGE,
    );
    const emailData = {
      from: `${process.env.EMAIL_USER}`,
      to: email,
      subject: "Email Verification",
      html: onRegisterVerificationEmail({ email: email, code: code }),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isProduction
      ? sendEmailWithNodemailer(emailData)
      : sendEmailUsingMailhog(emailData);
    //todo : HEATOS links

    //set the session token
    res.cookie(ACCESS_TOKEN_NAME, token, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax", // "none" for production, "lax" for development
      secure: isProduction, // true for production, false for development
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE, // 1 minute
    });
    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
      token,
      code: isProduction ? undefined : code,
    });
  } catch (error) {
    // console.log(error);
    handleError(error, res);
  }
};
