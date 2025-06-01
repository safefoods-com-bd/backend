import { Request, Response } from "express";
import { and, eq, inArray } from "drizzle-orm";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { db } from "@/db/db";
import warehouseTable from "@/db/schema/stock-management/warehouses";
import {
  deleteWarehouseValidationSchema,
  deleteWarehousesBatchValidationSchema,
} from "../warehouses.validation";
import { WAREHOUSE_ENDPOINTS } from "@/data/endpoints";

/**
 * Deletes a warehouse record by setting isDeleted flag to true
 * @param req Express request object
 * @param res Express response object
 */
export const deleteWarehouseV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteWarehouseValidationSchema.safeParse(
      req.body,
    );

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
      };
    }

    const { id } = validationResult.data;

    // Check if warehouse exists
    const existingWarehouse = await db
      .select()
      .from(warehouseTable)
      .where(
        and(eq(warehouseTable.id, id), eq(warehouseTable.isDeleted, false)),
      );

    if (existingWarehouse.length === 0) {
      throw { type: ERROR_TYPES.NOT_FOUND, message: "Warehouse not found" };
    }

    // Soft delete the warehouse (set isDeleted to true)
    const deletedWarehouse = await db
      .update(warehouseTable)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(eq(warehouseTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Warehouse deleted successfully",
      data: deletedWarehouse[0],
    });
  } catch (error) {
    handleError(error, res, "DELETE: /api/stock-management/warehouses/v1");
  }
};

/**
 * Deletes multiple warehouse records by setting isDeleted flag to true
 * @param req Express request object
 * @param res Express response object
 */
export const deleteWarehousesBatchV100 = async (
  req: Request,
  res: Response,
) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteWarehousesBatchValidationSchema.safeParse(
      req.body,
    );

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
      };
    }

    const { ids } = validationResult.data;

    // Soft delete the warehouses (set isDeleted to true)
    const deletedWarehouses = await db
      .update(warehouseTable)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(
        and(
          inArray(warehouseTable.id, ids),
          eq(warehouseTable.isDeleted, false),
        ),
      )
      .returning();

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedWarehouses.length} warehouses`,
      data: deletedWarehouses,
    });
  } catch (error) {
    handleError(error, res, WAREHOUSE_ENDPOINTS.DELETE_WAREHOUSES_BATCH);
  }
};
