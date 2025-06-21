import { Request, Response } from "express";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db/db";
import {
  usersTable,
  rolesTable,
  refreshTokensTable,
  usersToAccountsTable,
  permissionsTable,
  permissionToRolesTable,
} from "@/db/schema";
import { handleError } from "@/utils/errorHandler";
import {
  ACCESS_TOKEN_NAME,
  ACCESS_TOKEN_AGE,
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  isProduction,
  google,
  REFRESH_TOKEN_AGE,
  REFRESH_TOKEN_COOKIE_MAX_AGE,
  REFRESH_TOKEN_NAME,
} from "@/constants/variables";
import { DEFAULT_ROLE } from "@/constants/permissionsAndRoles";
import { encrypt } from "@/lib/authFunctions";

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export const googleSignIn = async (req: Request, res: Response) => {
  try {
    const { codeVerifier, savedState } = req.cookies;
    // Construct the full URL using the protocol and host from the request
    const fullUrl = `${req.protocol}://${req.get("host")}${req.url}`;
    const url = new URL(fullUrl);
    const searchParams = url.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // Validate required parameters
    if (!code || !state) {
      return res.redirect("/");
    }

    // Validate state and code verifier
    if (!codeVerifier || !savedState) {
      return res.status(400).json({
        success: false,
        message: "Code verifier or saved state is missing",
      });
    }

    if (savedState !== state) {
      return res.status(400).json({
        success: false,
        message: "State mismatch",
      });
    }

    // exchange code for tokens
    const tokens = await google.validateAuthorizationCode(
      code as string,
      codeVerifier,
    );

    // get accessToken from the function
    const googleAccessToken = tokens.accessToken();

    // Fetch user info from Google
    const googleRes = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
        method: "GET",
      },
    );

    const googleData = (await googleRes.json()) as GoogleUser;

    // Use transaction to ensure data consistency
    const userDetails = await db.transaction(async (tx) => {
      // Check if user exists
      const existingUser = await tx
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, googleData.email));

      let userId: string;

      if (existingUser.length === 0) {
        // Get the default role
        const defaultRole = await tx
          .select()
          .from(rolesTable)
          .where(eq(rolesTable.name, DEFAULT_ROLE));

        if (defaultRole.length === 0) {
          throw new Error(
            "No role found in the database. Not possible to register",
          );
        }

        // Create new user
        const [newUser] = await tx
          .insert(usersTable)
          .values({
            email: googleData.email,
            password: "",
            roleId: defaultRole[0].id,
            isDeleted: false,
            isVerified: true,
            registeredAt: new Date(),
          })
          .returning(); // This returns the inserted user

        userId = newUser.id;
      } else {
        // Update existing user
        await tx
          .update(usersTable)
          .set({ isVerified: true })
          .where(eq(usersTable.email, googleData.email));

        userId = existingUser[0].id;
      }

      // Check if the user-account relationship already exists
      const existingRelation = await tx
        .select()
        .from(usersToAccountsTable)
        .where(
          and(
            eq(usersToAccountsTable.userId, userId),
            eq(usersToAccountsTable.accountId, 2), // Google account ID
          ),
        );

      // Create the relationship only if it doesn't exist
      if (existingRelation.length === 0) {
        await tx.insert(usersToAccountsTable).values({
          userId: userId,
          accountId: 2,
        });
      }

      // Fetch updated user data
      const updatedUser = await tx
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
        .where(eq(usersTable.id, userId))
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

      const permissionsArray = updatedUser[0].permissions.split(",");

      const userDetails = {
        id: updatedUser[0].id,
        email: updatedUser[0].email,
        role: updatedUser[0].roleName,
        permissions: permissionsArray,
        isVerified: updatedUser[0].isVerified,
        isDeleted: updatedUser[0].isDeleted,
        registeredAt: updatedUser[0].registeredAt,
      };

      return userDetails;
    });

    const userData = { id: userDetails.id, email: userDetails.email };

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

    // Save the refresh token in the database
    await db
      .insert(refreshTokensTable)
      .values({
        token: refreshToken,
        userId: userData.id,
        expiresAt: new Date(
          new Date().getTime() + REFRESH_TOKEN_COOKIE_MAX_AGE,
        ),
        deviceInfo: req.headers["user-agent"] || "unknown",
      })
      .returning();

    // Set the access token in the cookie
    res.cookie(ACCESS_TOKEN_NAME, accessToken, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax", // "none" for production, "lax" for development
      secure: isProduction, // true for production, false for development
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
      // domain: isProduction ? COMMON_BASE : undefined,
    });

    // Set the refresh token in the cookie
    res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax", // "none" for production, "lax" for development
      secure: isProduction, // true for production, false for development
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
      // domain: isProduction ? COMMON_BASE : undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userDetails,
    });
  } catch (error) {
    // console.error("error", error);
    handleError(error, res);
  }
};
