import { db } from "@/db/db";
import { permissionsTable } from "@/db/schema";
import { validateZodSchema } from "@/middleware/validationMiddleware";
import { count, desc, sql } from "drizzle-orm";
import { Request, Response } from "express";
import { createPermissionSchema } from "./permissionsValidation";
import { handleError } from "@/utils/errorHandler";
import {
  generateHateoasLinksForCollection,
  generateHateoasLinksForSingleRecord,
} from "@/utils/generateHateoasLinks";

export const listAllPermissions = async (req: Request, res: Response) => {
  try {
    // check user session

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
    // Fetch permissions
    const query = db
      .select()
      .from(permissionsTable)
      .orderBy(
        sort === "desc" ? desc(permissionsTable.id) : permissionsTable.id,
      )
      .limit(limit ? +limit : 10)
      .offset(offset ? +offset : 0);
    // Apply search filter
    if (search) {
      query.where(
        sql`LOWER(${permissionsTable.name}) ILIKE LOWER(${"%" + search + "%"})`,
      );
    }
    // Execute query
    const permissions = await query;

    // get total count
    const totalCountQuery = db
      .select({ count: count() })
      .from(permissionsTable);
    if (search) {
      totalCountQuery.where(
        sql`LOWER(${permissionsTable.name}) ILIKE LOWER(${"%" + search + "%"})`,
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
      data: permissions,
      pagination: {
        offset: offset,
        limit: limit,
        total: totalCount[0]?.count,
        currentCount: permissions.length,
      },
      _links,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getSinglePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }
    const permission = await db
      .select()
      .from(permissionsTable)
      .where(sql`${permissionsTable.id} = ${sql.param(id)}`);
    if (permission.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }
    const _links = generateHateoasLinksForSingleRecord({
      baseUrl: `${req.protocol}://${req.get("host")}${req.baseUrl}`,
      id: permission[0].id,
    });
    res.status(200).json({
      success: true,
      data: permission,
      _links,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const createPermissions = async (req: Request, res: Response) => {
  try {
    const validation = validateZodSchema(createPermissionSchema)(req.body);

    const { name, description } = validation;
    // Check if permission already exists
    const permissionExists = await db
      .select()
      .from(permissionsTable)
      .where(sql`${permissionsTable.name} = ${sql.param(name)}`);
    if (permissionExists.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Permission already exists",
      });
    }
    // Create new permission
    const newPermission = await db
      .insert(permissionsTable)
      .values({ name, description })
      .returning();
    const _links = generateHateoasLinksForSingleRecord({
      baseUrl: `${req.protocol}://${req.get("host")}${req.baseUrl}`,
      id: newPermission[0].id,
    });
    res.status(201).json({
      success: true,
      data: newPermission,
      message: "Permission created successfully",
      _links,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateSinglePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Permission ID is required",
      });
    }
    const validation = validateZodSchema(createPermissionSchema)(req.body);
    const { name, description } = validation;
    // Check if permission already exists
    const permissionExists = await db
      .select()
      .from(permissionsTable)
      .where(sql`${permissionsTable.name} = ${sql.param(name)}`);
    // return if permission not found
    if (permissionExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }
    // return if permission already exists with the same name
    if (
      permissionExists.length > 0 &&
      permissionExists[0].id !== parseInt(id)
    ) {
      return res.status(409).json({
        success: false,
        message: "Permission already exists with the same name",
      });
    }

    // Update permission
    const updatedPermission = await db
      .update(permissionsTable)
      .set({ name, description })
      .where(sql`${permissionsTable.id} = ${sql.param(id)}`)
      .returning();
    const _links = generateHateoasLinksForSingleRecord({
      baseUrl: `${req.protocol}://${req.get("host")}${req.baseUrl}`,
      id: updatedPermission[0].id,
    });
    res.status(200).json({
      success: true,
      data: updatedPermission,
      message: "Permission updated successfully",
      _links,
    });
  } catch (error) {
    return handleError(error, res);
  }
};
