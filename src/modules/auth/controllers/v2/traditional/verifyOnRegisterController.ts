import { handleError } from "@/utils/errorHandler";
import { Request, Response } from "express";
import { verifyOnRegisterSchema } from "../../../authValidations";
import { validateZodSchema } from "@/middleware/validationMiddleware";
import { db } from "@/db/db";
import { usersTable, usersToAccountsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decryptTokenData } from "@/lib/authFunctions";
import { USER_ACCOUNT_TYPE } from "@/data/constants";

export const verifyOnRegisterV200 = async (req: Request, res: Response) => {
  try {
    const { otp, email } = await validateZodSchema(verifyOnRegisterSchema)(
      req.body,
    );
    const email_verification_token = req.headers.email_verification_token;
    console.log("email_verification_token", email_verification_token);
    // Check if email verification token is provided
    if (!email_verification_token) {
      return res.status(400).json({
        success: false,
        message: "Email verification token is missing",
      });
    }
    // verify the token and otp
    // Check if user with this email already exists
    const userExists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    console.log("userExists", userExists);
    // If user does not exist, return error
    if (userExists.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email does not exist",
      });
    }
    // If user exists and is verified, return error
    if (userExists[0].isVerified) {
      return res.status(400).json({
        success: false,
        message: "User with this email is already verified",
      });
    }
    // verify the token and otp
    const tokenData = await decryptTokenData(
      email_verification_token as string,
    );
    console.log("tokenData", tokenData);
    if (tokenData.success === false) {
      return res.status(400).json({
        success: false,
        message: tokenData.message,
      });
    }
    const emailFromToken = tokenData.data.email;
    const otpFromToken = tokenData.data.otp;
    // If token and otp are invalid, return error
    if (email !== emailFromToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }
    if (+otp !== +otpFromToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP submitted.",
      });
    }

    // Update the user: set isVerified to true, and add registeredAt timestamp,
    // Start a transaction for updating user and inserting account provider
    const updatedUser = await db.transaction(async (tx) => {
      const user = await tx
        .update(usersTable)
        .set({
          isVerified: true,
          registeredAt: new Date(),
        })
        .where(eq(usersTable.email, email))
        .returning({
          id: usersTable.id,
          email: usersTable.email,
          roleId: usersTable.roleId,
          isVerified: usersTable.isVerified,
          registeredAt: usersTable.registeredAt,
        });

      // Add provider to the accounts tables;
      await tx.insert(usersToAccountsTable).values({
        userId: user[0].id,
        providerName: USER_ACCOUNT_TYPE.TRADITIONAL,
      });

      return user;
    });

    return res.status(200).json({
      success: true,
      message: "User verified successfully",
      data: updatedUser[0],
    });
  } catch (error) {
    handleError(error, res);
  }
};
