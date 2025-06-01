import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { unitsTable } from "@/db/schema/utils/units";
import { unitValidationSchema } from "../units.validation";
import { eq, or } from "drizzle-orm";
import { UNIT_ENDPOINTS } from "@/data/endpoints";

/**
 * Creates a new unit record in the database
 * @param req Express request object
 * @param res Express response object
 */
export const createUnitV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = unitValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: UNIT_ENDPOINTS.CREATE_UNIT,
      };
    }

    const { code, title, baseUnit, operator, operationValue } =
      validationResult.data;

    // Check if unit with the same code already exists
    const existingUnit = await db
      .select()
      .from(unitsTable)
      .where(or(eq(unitsTable.code, code), eq(unitsTable.title, title)));

    if (existingUnit.length > 0) {
      throw {
        type: ERROR_TYPES.CONFLICT,
        message: "Unit with this name/code already exists",
        endpoint: UNIT_ENDPOINTS.CREATE_UNIT,
      };
    }

    // Create unit record
    const newUnit = await db
      .insert(unitsTable)
      .values({
        code,
        title,
        baseUnit,
        operator,
        operationValue,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Unit created successfully",
      data: newUnit[0],
    });
  } catch (error) {
    handleError(error, res, UNIT_ENDPOINTS.CREATE_UNIT);
  }
};
