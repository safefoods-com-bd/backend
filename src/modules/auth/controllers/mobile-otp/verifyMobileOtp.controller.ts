import { Request, Response } from "express";
import { verifyMobileOtpSchema } from "../../authValidations";
import { validateZodSchema } from "@/middleware/validationMiddleware";
import { decryptTokenData } from "@/lib/authFunctions";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { AUTH_ENDPOINTS } from "@/data/endpoints";
import { db } from "@/db/db";
import {
  permissionsTable,
  permissionToRolesTable,
  rolesTable,
  usersTable,
  usersToAccountsTable,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { DEFAULT_ROLE } from "@/constants/permissionsAndRoles";
import { USER_ACCOUNT_TYPE } from "@/data/constants";
import { handleAuthTokens } from "@/lib/tokenUtils";

export const verifyMobileOtpV100 = async (req: Request, res: Response) => {
  try {
    const validation = validateZodSchema(verifyMobileOtpSchema)(req.body);
    const { otp_verification_token } = req.cookies;
    if (!otp_verification_token) {
      throw {
        type: ERROR_TYPES.BAD_REQUEST,
        message: "OTP token is missing",
      };
    }
    const { phoneNumber, otp } = validation;

    // Decrypt the token to get the original OTP
    const tokenData = await decryptTokenData(otp_verification_token);
    if (tokenData.success === false) {
      throw {
        type: ERROR_TYPES.BAD_REQUEST,
      };
    }
    const phoneNumberFromToken = tokenData.data.phoneNumber;
    const otpFromToken = tokenData.data.otp;
    if (phoneNumber !== phoneNumberFromToken) {
      throw {
        type: ERROR_TYPES.BAD_REQUEST,
      };
    }
    if (otp !== otpFromToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //check already registered user or not
    const existUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.phoneNumber, phoneNumber));
    if (existUser.length === 0) {
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
      const newUser = await db
        .insert(usersTable)
        .values({
          phoneNumber: phoneNumber,
          isVerified: true,
          roleId: getDefaultRole[0].id,
        })
        .returning();
      await db.insert(usersToAccountsTable).values({
        userId: newUser[0].id,
        providerName: USER_ACCOUNT_TYPE.MOBILE_OTP,
      });
    }

    const userDetails = await db
      .select({
        id: usersTable.id,
        phoneNumber: usersTable.phoneNumber,
        password: usersTable.password,
        roleId: usersTable.roleId,
        roleName: rolesTable.name,
        isVerified: usersTable.isVerified,
        isDeleted: usersTable.isDeleted,
        registeredAt: usersTable.registeredAt,
        permissions: sql<string>`STRING_AGG(${permissionsTable.name}, ',')`,
      })
      .from(usersTable)
      .where(eq(usersTable.phoneNumber, phoneNumber))
      .leftJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
      .leftJoin(
        permissionToRolesTable,
        sql`${rolesTable.id} = ${permissionToRolesTable.roleId}`,
      )
      .leftJoin(
        permissionsTable,
        sql`${permissionToRolesTable.permissionId} = ${permissionsTable.id}`,
      )
      .groupBy(usersTable.id, rolesTable.id);

    const userInfo = {
      id: userDetails[0].id,
      phoneNumber: userDetails[0].phoneNumber || "",
      role: userDetails[0].roleName || "",
      permissions: userDetails[0].permissions
        ? userDetails[0].permissions.split(",")
        : [],
      isVerified: !!userDetails[0].isVerified,
      isDeleted: !!userDetails[0].isDeleted,
      registeredAt: userDetails[0].registeredAt || new Date(0),
    };

    // Generate access/refresh tokens and handle auth tokens
    const updatedUserDetails = await handleAuthTokens(
      { phoneNumber: userInfo.phoneNumber, id: userInfo.id },
      userInfo,
      req,
      res,
    );

    return res.status(200).json({
      message: "OTP verified successfully",
      success: true,
      data: updatedUserDetails,
    });
  } catch (error) {
    handleError(error, res, AUTH_ENDPOINTS.VERIFY_MOBILE_OTP);
  }
};
