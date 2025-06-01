import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import warehouseTable from "@/db/schema/stock-management/warehouses";
import { and, eq } from "drizzle-orm";
import { updateWarehouseValidationSchema } from "../warehouses.validation";
import { WAREHOUSE_ENDPOINTS } from "@/data/endpoints";

/**
 * Updates an existing warehouse record in the database
 * @param req Express request object
 * @param res Express response object
 */
export const updateWarehouseV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = updateWarehouseValidationSchema.safeParse(
      req.body,
    );

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: WAREHOUSE_ENDPOINTS.UPDATE_WAREHOUSE,
      };
    }

    const { id, ...updateData } = validationResult.data;

    // Check if warehouse exists
    const existingWarehouse = await db
      .select()
      .from(warehouseTable)
      .where(
        and(eq(warehouseTable.id, id), eq(warehouseTable.isDeleted, false)),
      );

    if (existingWarehouse.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Warehouse not found",
        endpoint: WAREHOUSE_ENDPOINTS.UPDATE_WAREHOUSE,
      };
    }

    // Update the warehouse record
    const updatedWarehouse = await db
      .update(warehouseTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(warehouseTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Warehouse updated successfully",
      data: updatedWarehouse[0],
    });
  } catch (error) {
    handleError(error, res, WAREHOUSE_ENDPOINTS.UPDATE_WAREHOUSE);
  }
};
