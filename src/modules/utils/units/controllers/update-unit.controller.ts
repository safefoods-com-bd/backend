import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import unitsTable from "@/db/schema/utils/units";
import { eq, or } from "drizzle-orm";
import { updateUnitValidationSchema } from "../units.validation";
import { UNIT_ENDPOINTS } from "@/data/endpoints";

/**
 * Updates an existing unit record in the database
 * @param req Express request object
 * @param res Express response object
 */
export const updateUnitV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = updateUnitValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: UNIT_ENDPOINTS.UPDATE_UNIT,
      };
    }

    const { id, ...updateData } = validationResult.data;

    // Check if unit exists
    const existingUnit = await db
      .select()
      .from(unitsTable)
      .where(eq(unitsTable.id, id));

    if (existingUnit.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Unit not found",
        endpoint: UNIT_ENDPOINTS.UPDATE_UNIT,
      };
    }

    // If code is being updated, check if it already exists
    if (updateData.code || updateData.title) {
      const codeExists = await db
        .select()
        .from(unitsTable)
        .where(
          or(
            eq(unitsTable.code, updateData.code),
            eq(unitsTable.title, updateData.title), // Not the current unit
          ),
        );

      if (codeExists.length > 0) {
        throw {
          type: ERROR_TYPES.CONFLICT,
          message: "Unit with this code/title already exists",
          endpoint: UNIT_ENDPOINTS.UPDATE_UNIT,
        };
      }
    }

    // Update the unit record

    const updatedUnit = await db
      .update(unitsTable)
      .set(updateData)
      .where(eq(unitsTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Unit updated successfully",
      data: updatedUnit[0],
    });
  } catch (error) {
    handleError(error, res, UNIT_ENDPOINTS.UPDATE_UNIT);
  }
};
