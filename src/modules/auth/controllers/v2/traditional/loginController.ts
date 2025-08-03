import { validateZodSchema } from "@/middleware/validationMiddleware";
import { loginUserSchema } from "../../../authValidations";
import {
  permissionsTable,
  permissionToRolesTable,
  rolesTable,
  usersTable,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db/db";
import { Request, Response } from "express";
import { handleError } from "@/utils/errorHandler";
import { compare } from "bcryptjs";
import { encrypt } from "@/lib/authFunctions";
import { ACCESS_TOKEN_AGE, REFRESH_TOKEN_AGE } from "@/constants/variables";

export const loginV200 = async (req: Request, res: Response) => {
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
    const passwordMatch = await compare(password, userExists[0].password!);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Normalize all possibly-null fields for userDetails
    const userDetails = {
      id: userExists[0].id,
      email: userExists[0].email || "",
      role: userExists[0].roleName || "",
      permissions: permissionsArray,
      isVerified: !!userExists[0].isVerified,
      isDeleted: !!userExists[0].isDeleted,
      registeredAt: userExists[0].registeredAt || new Date(0),
    };

    const accessToken = await encrypt({ userDetails }, ACCESS_TOKEN_AGE);
    const refreshToken = await encrypt({ userDetails }, REFRESH_TOKEN_AGE);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userDetails,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

    //todo : HEATOS links
  } catch (error) {
    handleError(error, res);
  }
};
