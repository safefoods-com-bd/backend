import { db } from "@/db/db";
import {
  usersTable,
  rolesTable,
  permissionsTable,
  permissionToRolesTable,
} from "@/db/schema";
import { handleError } from "@/utils/errorHandler";
import {
  generateHateoasLinksForCollection,
  generateHateoasLinksForSingleRecord,
} from "@/utils/generateHateoasLinks";
import { count, desc, eq, sql } from "drizzle-orm";
import { Request, Response } from "express";
import { validateZodSchema } from "@/middleware/validationMiddleware";
import { createUserSchema } from "./usersValidation";
import { getPermissions } from "@/lib/authFunctions";

export const listAllUsers = async (req: Request, res: Response) => {
  try {
    const search = req.query.search
      ? String(req.query.search).trim()
      : undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const sort = (req.query.sort as string) || "desc";

    if (limit < 0 || offset < 0) {
      return res.status(400).json({
        success: false,
        message: "Limit and offset must be non-negative integers.",
      });
    }

    const query = db
      .select()
      .from(usersTable)
      .orderBy(sort === "desc" ? desc(usersTable.id) : usersTable.id)
      .limit(limit)
      .offset(offset)
      .leftJoin(rolesTable, sql`${usersTable.roleId} = ${rolesTable.id}`)
      .leftJoin(
        permissionsTable,
        sql`${rolesTable.id} = ${permissionsTable.id}`,
      );

    if (search) {
      query.where(
        sql`LOWER(${usersTable.email}) ILIKE LOWER(${"%" + search + "%"})`,
      );
    }

    const users = await query;
    const results = users.map((user) => ({
      user: user.users,
      role: user.roles,
      permissions: user.permissions,
    }));

    const totalCountQuery = db.select({ count: count() }).from(usersTable);
    if (search) {
      totalCountQuery.where(
        sql`LOWER(${usersTable.email}) ILIKE LOWER(${"%" + search + "%"})`,
      );
    }
    const totalCount = await totalCountQuery;

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const _links = generateHateoasLinksForCollection({
      baseUrl,
      offset,
      limit,
      totalCount: totalCount[0]?.count || 0,
      search,
    });

    res.status(200).json({
      success: true,
      data: results,
      pagination: {
        offset,
        limit,
        total: totalCount[0]?.count,
        currentCount: users.length,
      },
      _links,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const user = await db
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
      .where(eq(usersTable.id, +id))
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

    const permissionsArray = user[0].permissions.split(",");
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = {
      id: user[0].id,
      email: user[0].email,
      isVerified: user[0].isVerified,
      isDeleted: user[0].isDeleted,
      registeredAt: user[0].registeredAt,
      role: user[0].roleName,
      permissions: permissionsArray,
    };

    const _links = generateHateoasLinksForSingleRecord({
      baseUrl: `${req.protocol}://${req.get("host")}${req.baseUrl}`,
      id: user[0].id,
    });

    res.status(200).json({
      success: true,
      data: userData,
      _links,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getUserPermissions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const permissions = await getPermissions(+id);

    res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const validation = validateZodSchema(createUserSchema)(req.body);
    const { email, password, isVerified, isDeleted, roleId } = validation;
    // Check if user with this email already exists
    const userExists = await db
      .select()
      .from(usersTable)
      .where(sql`email = ${email}`);
    if (userExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    // Create new user
    const newUser = await db
      .insert(usersTable)
      .values({
        email,
        password,
        isVerified,
        isDeleted,
        roleId,
      })
      .returning();

    const _links = generateHateoasLinksForSingleRecord({
      baseUrl: `${req.protocol}://${req.get("host")}${req.baseUrl}`,
      id: newUser[0].id,
    });

    res.status(201).json({
      success: true,
      data: newUser,
      message: "User created successfully",
      _links,
    });
  } catch (error) {
    handleError(error, res);
  }
};
