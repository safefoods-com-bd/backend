import { encrypt } from "@/lib/authFunctions";
import { db } from "@/db/db";
import refreshTokensTable from "@/db/schema/user-management/refresh_tokens";
import { UAParser } from "ua-parser-js";
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
import { Request, Response } from "express";

export interface UserData {
  id: string;
  email?: string;
  phoneNumber?: string;
}

export interface UserDetails {
  id: string;
  email?: string;
  phoneNumber?: string;
  role: string;
  permissions: string[];
  isVerified: boolean;
  isDeleted: boolean;
  registeredAt: Date;
}

/**
 * Generates access/refresh tokens, saves refresh token, sets cookies, and returns updated userDetails
 */
export const handleAuthTokens = async (
  userData: UserData,
  userDetails: UserDetails,
  req: Request,
  res: Response,
): Promise<UserDetails> => {
  // Generate access token and refresh token
  const accessToken = await encrypt({ userData }, ACCESS_TOKEN_AGE);
  const refreshToken = await encrypt({ userData }, REFRESH_TOKEN_AGE);

  // Save the refresh token in the database
  const userAgent: string = req.headers["user-agent"] || "unknown";
  const parser = new UAParser(userAgent);

  const deviceInfo = {
    os: parser.getOS(),
    browser: parser.getBrowser(),
    device: parser.getDevice(),
    engine: parser.getEngine(),
  };
  await db
    .insert(refreshTokensTable)
    .values({
      token: refreshToken,
      userId: userData.id,
      expiresAt: new Date(new Date().getTime() + REFRESH_TOKEN_COOKIE_MAX_AGE),
      deviceInfo: JSON.stringify(deviceInfo),
    })
    .returning();

  // Set the access token in the cookie
  res.cookie(ACCESS_TOKEN_NAME, accessToken, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
    domain: isProduction ? COMMON_BASE : undefined,
  });

  // Set the refresh token in the cookie
  res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
    domain: isProduction ? COMMON_BASE : undefined,
  });

  return userDetails;
};
