import { db } from "@/db/db";
import {
  permissionsTable,
  permissionToRolesTable,
  rolesTable,
} from "@/db/schema";
import { handleError } from "@/utils/errorHandler";
import {
  generateHateoasLinksForCollection,
  generateHateoasLinksForSingleRecord,
} from "@/utils/generateHateoasLinks";
import { count, desc, sql } from "drizzle-orm";
import { Request, Response } from "express";
import { createRoleSchema } from "./rolesValidation";
import { validateZodSchema } from "@/middleware/validationMiddleware";

export const listAllRoles = async (req: Request, res: Response) => {
  try {
    // Get query params
    const search = req.query.search
      ? String(req.query.search).trim()
      : undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const sort = (req.query.sort as string) || "desc";
    // Validate limit and offset
    if (limit < 0 || offset < 0) {
      return res.status(400).json({
        success: false,
        message: "Limit and offset must be non-negative integers.",
      });
    }
    // Fetch roles
    const query = db
      .select()
      .from(rolesTable)
      .orderBy(sort === "desc" ? desc(rolesTable.id) : rolesTable.id)
      .limit(limit ? +limit : 10)
      .offset(offset ? +offset : 0)
      .leftJoin(
        permissionToRolesTable,
        sql`${rolesTable.id} = ${permissionToRolesTable.roleId}`,
      )
      .leftJoin(
        permissionsTable,
        sql`${permissionToRolesTable.permissionId} = ${permissionsTable.id}`,
      );

    // Apply search filter
    if (search) {
      query.where(
        sql`LOWER(${rolesTable.name}) ILIKE LOWER(${"%" + search + "%"})`,
      );
    }
    // Execute query
    const roles = await query;
    // Group permissions by role id
    const rolesMap = new Map<
      string,
      {
        role: (typeof roles)[number]["roles"];
        permissions: (typeof roles)[number]["permissions"][];
      }
    >();
    roles.forEach((row) => {
      const roleId = row.roles.id;
      if (!rolesMap.has(roleId)) {
        rolesMap.set(roleId, { role: row.roles, permissions: [] });
      }
      if (row.permissions) {
        rolesMap.get(roleId)!.permissions.push(row.permissions);
      }
    });

    const results = Array.from(rolesMap.values());
    // get total count
    const totalCountQuery = db.select({ count: count() }).from(rolesTable);
    if (search) {
      totalCountQuery.where(
        sql`LOWER(${rolesTable.name}) ILIKE LOWER(${"%" + search + "%"})`,
      );
    }
    const totalCount = await totalCountQuery;
    // Generate HATEOAS links
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
        offset: offset,
        limit: limit,
        total: totalCount[0]?.count,
        currentCount: roles.length,
      },
      _links,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getSingleRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }
    const role = await db
      .select()
      .from(rolesTable)
      .where(sql`${rolesTable.id} = ${sql.param(id)}`)
      .leftJoin(
        permissionToRolesTable,
        sql`${rolesTable.id} = ${permissionToRolesTable.roleId}`,
      )
      .leftJoin(
        permissionsTable,
        sql`${permissionToRolesTable.permissionId} = ${permissionsTable.id}`,
      );

    if (role.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }
    // Group permissions by role id
    const roleData = {
      role: role[0].roles,
      permissions: role
        .filter((row) => row.permissions)
        .map((row) => row.permissions),
    };

    const results = roleData;
    // console.log("results", results);
    // Generate HATEOAS links
    const _links = generateHateoasLinksForSingleRecord({
      baseUrl: `${req.protocol}://${req.get("host")}${req.baseUrl}`,
      id: role[0].roles.id,
    });
    res.status(200).json({
      success: true,
      data: results,
      _links,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const createRoles = async (req: Request, res: Response) => {
  try {
    // await checkPermission(req, res, () => {}, "read_permission");
    // Validate request body
    const validation = validateZodSchema(createRoleSchema)(req.body);
    const { name, description, permissions } = validation;
    // Check if permission already exists
    const roleExists = await db
      .select()
      .from(rolesTable)
      .where(sql`${rolesTable.name} = ${sql.param(name)}`);
    if (roleExists.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Role already exists",
      });
    }
    // Check if permissions exist
    if (permissions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one permission is required",
      });
    }

    // Create new role
    const newRole = await db
      .insert(rolesTable)
      .values({ name, description })
      .returning();
    // Create relation with permissions

    interface RolePermissionMapping {
      roleId: string;
      permissionId: number;
    }

    const newRolePermissions: RolePermissionMapping[] = permissions.map(
      (permissionId: number) => ({
        roleId: newRole[0].id,
        permissionId: permissionId,
      }),
    );

    await db
      .insert(permissionToRolesTable)
      .values(newRolePermissions)
      .execute();
    // Generate HATEOAS links
    const _links = generateHateoasLinksForSingleRecord({
      baseUrl: `${req.protocol}://${req.get("host")}${req.baseUrl}`,
      id: newRole[0].id,
    });
    res.status(201).json({
      success: true,
      data: newRole,
      message: "Role created successfully",
      _links,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateSingleRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Role ID is required",
      });
    }
    const validation = validateZodSchema(createRoleSchema)(req.body);
    const { name, description, permissions } = validation;
    // Check if role already exists
    const roleExists = await db
      .select()
      .from(rolesTable)
      .where(sql`${rolesTable.id} = ${sql.param(id)}`);
    // return if role not found
    if (roleExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }
    //check if role exists with the same name
    const roleExistsWithSameName = await db
      .select()
      .from(rolesTable)
      .where(sql`${rolesTable.name} = ${sql.param(name)}`);
    if (
      roleExistsWithSameName.length > 0 &&
      roleExistsWithSameName[0].id !== id
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Role already exists with the same name. Choose a different name",
      });
    }
    // there should be at least one permission
    if (permissions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one permission is required",
      });
    }

    // Update role
    const updatedRole = await db
      .update(rolesTable)
      .set({ name, description })
      .where(sql`${rolesTable.id} = ${sql.param(id)}`)
      .returning();
    // delete existing permissions
    await db
      .delete(permissionToRolesTable)
      .where(sql`${permissionToRolesTable.roleId} = ${sql.param(id)}`)
      .execute();
    // TO DO: check the input permissions are valid

    // create new role permission mapping
    const newRolePermissions = permissions.map((permissionId: number) => ({
      roleId: updatedRole[0].id,
      permissionId: permissionId,
    }));
    // insert new role permission mapping
    await db
      .insert(permissionToRolesTable)
      .values(newRolePermissions)
      .execute();
    // Generate HATEOAS links
    const _links = generateHateoasLinksForSingleRecord({
      baseUrl: `${req.protocol}://${req.get("host")}${req.baseUrl}`,
      id: updatedRole[0].id,
    });
    res.status(200).json({
      success: true,
      data: updatedRole,
      message: "Role updated successfully",
      _links,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const deleteSingleRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Role ID is required",
      });
    }
    // Check if role exists
    const roleExists = await db
      .select()
      .from(rolesTable)
      .where(sql`${rolesTable.id} = ${sql.param(id)}`);
    if (roleExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }
    // Delete role
    await db
      .delete(rolesTable)
      .where(sql`${rolesTable.id} = ${sql.param(id)}`)
      .execute();
    // Delete role permission mapping
    await db
      .delete(permissionToRolesTable)
      .where(sql`${permissionToRolesTable.roleId} = ${sql.param(id)}`)
      .execute();
    res.status(200).json({
      success: true,
      message: "Role and associated permissions are deleted successfully",
    });
  } catch (error) {
    return handleError(error, res);
  }
};
