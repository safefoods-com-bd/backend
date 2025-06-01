import { Request, Response } from "express";
import { eq, inArray } from "drizzle-orm";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { db } from "@/db/db";
import unitsTable from "@/db/schema/utils/units";
import {
  deleteUnitValidationSchema,
  deleteUnitsBatchValidationSchema,
} from "../units.validation";
import { UNIT_ENDPOINTS } from "@/data/endpoints";

/**
 * Deletes a unit record
 * @param req Express request object
 * @param res Express response object
 */
export const deleteUnitV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteUnitValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
      };
    }

    const { id } = validationResult.data;

    // Check if unit exists
    const existingUnit = await db
      .select()
      .from(unitsTable)
      .where(eq(unitsTable.id, id));

    if (existingUnit.length === 0) {
      throw { type: ERROR_TYPES.NOT_FOUND, message: "Unit not found" };
    }

    // Delete the unit
    const deletedUnit = await db
      .delete(unitsTable)
      .where(eq(unitsTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Unit deleted successfully",
      data: deletedUnit[0],
    });
  } catch (error) {
    handleError(error, res, UNIT_ENDPOINTS.DELETE_UNIT);
  }
};

/**
 * Deletes multiple unit records
 * @param req Express request object
 * @param res Express response object
 */
export const deleteUnitsBatchV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteUnitsBatchValidationSchema.safeParse(
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

    // Delete the units
    const deletedUnits = await db
      .delete(unitsTable)
      .where(inArray(unitsTable.id, ids))
      .returning();

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedUnits.length} units`,
      data: deletedUnits,
    });
  } catch (error) {
    handleError(error, res, UNIT_ENDPOINTS.DELETE_UNITS_BATCH);
  }
};
