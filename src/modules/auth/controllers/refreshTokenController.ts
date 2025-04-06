import { eq, sql } from "drizzle-orm";
import { db } from "@/db/db";
import { Request, Response } from "express";
import { encrypt } from "@/lib/authFunctions";

import { handleError } from "@/utils/errorHandler";

import {
  ACCESS_TOKEN_AGE,
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  ACCESS_TOKEN_NAME,
  isProduction,
  REFRESH_TOKEN_AGE,
  REFRESH_TOKEN_COOKIE_MAX_AGE,
  REFRESH_TOKEN_NAME,
} from "@/constants/variables";
import refreshTokensTable from "@/db/schema/user-management/refresh_tokens";
import { UAParser } from "ua-parser-js";

export const refreshTokenRequest = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    // Check if refresh token exists
    const refreshTokenExists = await db
      .select()
      .from(refreshTokensTable)
      .where(eq(refreshTokensTable.token, refresh_token));

    // console.log("refreshTokenExists", refreshTokenExists);

    // If refresh token does not exist or has expired, return error
    if (
      refreshTokenExists.length === 0 ||
      refreshTokenExists[0].expiresAt < new Date()
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const userData = {
      id: refreshTokenExists[0].userId,
    };

    // Generate new access token
    const newAccessToken = await encrypt({ userData }, ACCESS_TOKEN_AGE);
    // Generate new refresh token
    const newRefreshToken = await encrypt({ userData }, REFRESH_TOKEN_AGE);

    // Delete all refresh tokens except the last 5
    await db.execute(sql`
      DELETE FROM ${refreshTokensTable}
      WHERE ${refreshTokensTable.userId} = ${userData.id}
      AND ${refreshTokensTable.id} NOT IN (
        SELECT ${refreshTokensTable.id}
        FROM ${refreshTokensTable}
        WHERE ${refreshTokensTable.userId} = ${userData.id}
        ORDER BY ${refreshTokensTable.createdAt} DESC
        LIMIT 4
      )
    `);
    // Save the new access token in the database
    const userAgent: string = req.headers["user-agent"] || "unknown";
    const parser = new UAParser(userAgent);

    const deviceInfo = {
      os: parser.getOS(), // { name: 'Linux', version: '' }
      browser: parser.getBrowser(), // { name: 'Chrome', version: '132.0.0.0' }
      device: parser.getDevice(), // { model: 'Nexus 5', type: 'mobile', vendor: '' }
      engine: parser.getEngine(), // { name: 'WebKit', version: '537.36' }
    };
    // console.log("userAgent", userAgent);
    // console.log("deviceInfo", deviceInfo);

    await db
      .insert(refreshTokensTable)
      .values({
        token: newRefreshToken,
        userId: userData.id,
        expiresAt: new Date(
          new Date().getTime() + REFRESH_TOKEN_COOKIE_MAX_AGE,
        ),
        deviceInfo: JSON.stringify(deviceInfo),
      })
      .returning();

    // Set the access token in the cookie
    res.cookie(ACCESS_TOKEN_NAME, newAccessToken, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax", // "none" for production, "lax" for development
      secure: isProduction, // true for production, false for development
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
      // domain: isProduction ? COMMON_BASE : undefined,
    });

    // Set the refresh token in the cookie
    res.cookie(REFRESH_TOKEN_NAME, newRefreshToken, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax", // "none" for production, "lax" for development
      secure: isProduction, // true for production, false for development
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
      // domain: isProduction ? COMMON_BASE : undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    // console.log("error", error);
    handleError(error, res);
  }
};
