import { handleError } from "@/utils/errorHandler";
import { Request, Response } from "express";
import { verifyOnRegisterSchema } from "../../authValidations";
import { validateZodSchema } from "@/middleware/validationMiddleware";
import { db } from "@/db/db";
import { accountsTable, usersTable, usersToAccountsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decryptTokenData } from "@/lib/authFunctions";
import { ACCESS_TOKEN_NAME } from "@/constants/variables";
import { USER_ACCOUNT_TYPE } from "@/data/constants";

export const verifyOnRegister = async (req: Request, res: Response) => {
  try {
    const { token, code, email } = await validateZodSchema(
      verifyOnRegisterSchema,
    )(req.body);
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
    if (userExists[0].isVerified) {
      return res.status(400).json({
        success: false,
        message: "User with this email is already verified",
      });
    }
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
    // If token and code are invalid, return error
    if (email !== emailFromToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }
    if (+code !== +codeFromToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid code",
      });
    }

    // ---- If token and code are valid, update the user

    // Update the user: set isVerified to true, and add registeredAt timestamp,
    const updatedUser = await db
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

    // Add provider to the accounts tables
    const accountId = await db
      .select({ id: accountsTable.id })
      .from(accountsTable)
      .where(eq(accountsTable.provider_name, USER_ACCOUNT_TYPE.TRADITIONAL))
      .limit(1);
    await db.insert(usersToAccountsTable).values({
      userId: updatedUser[0].id,
      accountId: accountId[0].id,
    });

    // Clear the access token cookie
    res.clearCookie(ACCESS_TOKEN_NAME);

    return res.status(200).json({
      success: true,
      message: "User verified successfully",
      data: updatedUser[0],
    });
  } catch (error) {
    handleError(error, res);
  }
};
