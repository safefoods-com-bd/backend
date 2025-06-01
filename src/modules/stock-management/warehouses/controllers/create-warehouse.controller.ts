import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import warehouseTable from "@/db/schema/stock-management/warehouses";
import { warehouseValidationSchema } from "../warehouses.validation";
import { and, eq, or } from "drizzle-orm";
import { WAREHOUSE_ENDPOINTS } from "@/data/endpoints";

/**
 * Creates a new warehouse record in the database
 * @param req Express request object
 * @param res Express response object
 */
export const createWarehouseV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = warehouseValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: WAREHOUSE_ENDPOINTS.CREATE_WAREHOUSE,
      };
    }

    const { name, location, contactNumber, email, isActive } =
      validationResult.data;

    // Check if warehouse with the same name already exists
    const existingWarehouse = await db
      .select()
      .from(warehouseTable)
      .where(
        and(
          or(
            eq(warehouseTable.name, name),
            eq(warehouseTable.location, location),
          ),
          eq(warehouseTable.isDeleted, false),
        ),
      );
    if (existingWarehouse.length > 0) {
      throw {
        type: ERROR_TYPES.CONFLICT,
        message: "Warehouse with this name/location already exists",
        endpoint: WAREHOUSE_ENDPOINTS.CREATE_WAREHOUSE,
      };
    }
    // Create warehouse record
    const newWarehouse = await db
      .insert(warehouseTable)
      .values({
        name,
        location,
        contactNumber,
        email,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Warehouse created successfully",
      data: newWarehouse[0],
    });
  } catch (error) {
    handleError(error, res, WAREHOUSE_ENDPOINTS.CREATE_WAREHOUSE);
  }
};
