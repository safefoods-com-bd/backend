import { validateZodSchema } from "@/middleware/validationMiddleware";
import { loginUserSchema } from "../authValidations";
import {
  permissionsTable,
  permissionToRolesTable,
  rolesTable,
  usersTable,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db/db";
import { Request, Response } from "express";
import { encrypt } from "@/lib/authFunctions";

import { handleError } from "@/utils/errorHandler";
import { compare } from "bcryptjs";
import {
  ACCESS_TOKEN_AGE,
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  isProduction,
  REFRESH_TOKEN_AGE,
  REFRESH_TOKEN_COOKIE_MAX_AGE,
  REFRESH_TOKEN_NAME,
  ACCESS_TOKEN_NAME,
  COMMON_BASE,
} from "@/constants/variables";
import refreshTokensTable from "@/db/schema/user-management/refresh_tokens";
import { UAParser } from "ua-parser-js";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = await validateZodSchema(loginUserSchema)(
      req.body,
    );

    const userExists = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        password: usersTable.password,
        roleId: usersTable.roleId,
        roleName: rolesTable.name,
        isVerified: usersTable.isVerified,
        isDeleted: usersTable.isDeleted,
        registeredAt: usersTable.registeredAt,
        permissions: sql<string>`STRING_AGG(${permissionsTable.name}, ',')`,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .leftJoin(rolesTable, sql`${usersTable.roleId} = ${rolesTable.id}`)
      .leftJoin(
        permissionToRolesTable,
        sql`${rolesTable.id} = ${permissionToRolesTable.roleId}`,
      )
      .leftJoin(
        permissionsTable,
        sql`${permissionToRolesTable.permissionId} = ${permissionsTable.id}`,
      )
      .groupBy(usersTable.id, rolesTable.id);

    // If user exists and is verified, return error
    if (userExists.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email does not exist",
      });
    }
    // If user exists and is not verified, return error
    if (!userExists[0].isVerified) {
      return res.status(400).json({
        success: false,
        message: "User with this email is not verified",
      });
    }

    const permissionsArray = userExists[0].permissions.split(",");

    // check the password from database
    const passwordMatch = await compare(password, userExists[0].password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const userData = {
      id: userExists[0].id,
      email: userExists[0].email,
    };
    const userDetails = {
      id: userExists[0].id,
      email: userExists[0].email,
      role: userExists[0].roleName,
      permissions: permissionsArray,
      isVerified: userExists[0].isVerified,
      isDeleted: userExists[0].isDeleted,
      registeredAt: userExists[0].registeredAt,
      accessToken: "", // will be set later
    };

    // Generate access token and refresh token
    const accessToken = await encrypt(
      {
        userData,
      },
      ACCESS_TOKEN_AGE,
    );
    const refreshToken = await encrypt(
      {
        userData,
      },
      REFRESH_TOKEN_AGE,
    );

    userDetails.accessToken = accessToken;

    // Save the refresh token in the database
    const userAgent: string = req.headers["user-agent"] || "unknown";
    const parser = new UAParser(userAgent);

    const deviceInfo = {
      os: parser.getOS(), // { name: 'Linux', version: '' }
      browser: parser.getBrowser(), // { name: 'Chrome', version: '132.0.0.0' }
      device: parser.getDevice(), // { model: 'Nexus 5', type: 'mobile', vendor: '' }
      engine: parser.getEngine(), // { name: 'WebKit', version: '537.36' }
    };
    await db
      .insert(refreshTokensTable)
      .values({
        token: refreshToken,
        userId: userData.id,
        expiresAt: new Date(
          new Date().getTime() + REFRESH_TOKEN_COOKIE_MAX_AGE,
        ),
        deviceInfo: JSON.stringify(deviceInfo),
      })
      .returning();

    // Set the access token in the cookie
    res.cookie(ACCESS_TOKEN_NAME, accessToken, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax", // "none" for production, "lax" for development
      secure: isProduction, // true for production, false for development
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
      domain: isProduction ? COMMON_BASE : undefined,
    });

    // Set the refresh token in the cookie
    res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax", // "none" for production, "lax" for development
      secure: isProduction, // true for production, false for development
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
      domain: isProduction ? COMMON_BASE : undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userDetails,
    });

    //todo : HEATOS links
  } catch (error) {
    handleError(error, res);
  }
};
