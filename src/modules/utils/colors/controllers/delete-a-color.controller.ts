import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { eq, inArray } from "drizzle-orm";
import colorTables from "@/db/schema/utils/colors";
import {
  batchDeleteColorValidationSchema,
  deleteColorValidationSchema,
} from "../colors.validation";
import { COLOR_ENDPOINTS } from "@/data/endpoints";

/**
 * Deletes a single color record from the database
 *
 * @async
 * @function deleteColorSingleV100
 * @param {Request} req - Express request object containing the color id in the body
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} A Promise resolving to a response confirming the deletion
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 * @throws {Object} Throws an error object with type NOT_FOUND if color with the given id doesn't exist
 *
 * @description
 * This controller handles DELETE requests to remove a color record.
 * It validates the incoming request body for a valid color ID.
 * If validation passes and the color exists, it deletes the color record.
 * Returns a 200 status with success message on successful deletion.
 */
export const deleteColorSingleV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const validation = deleteColorValidationSchema.safeParse(req.body);

    if (!validation.success) {
      console.error(
        "Validation error in deleteColorSingleV100:",
        validation.error.errors,
      );
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { id } = validation.data;

    const deletedColor = await db
      .delete(colorTables)
      .where(eq(colorTables.id, id))
      .returning({ id: colorTables.id });

    if (deletedColor.length === 0) {
      throw { type: ERROR_TYPES.NOT_FOUND, message: "Color not found" };
    }

    return res.status(200).json({
      success: true,
      message: "Color deleted successfully",
      data: deletedColor[0],
    });
  } catch (error) {
    return handleError(error, res, COLOR_ENDPOINTS.DELETE_COLOR);
  }
};

/**
 * Deletes multiple color records from the database in a batch operation
 *
 * @async
 * @function deleteColorBatchV100
 * @param {Request} req - Express request object containing an array of color ids in the body
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} A Promise resolving to a response confirming the batch deletion
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 *
 * @description
 * This controller handles DELETE requests to remove multiple color records.
 * It expects an array of color IDs in the request body.
 * If validation passes, it deletes all the specified color records.
 * Returns a 200 status with success message and count of deleted records.
 */
export const deleteColorBatchV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const validation = batchDeleteColorValidationSchema.safeParse(req.body);
    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }
    const { ids } = validation.data;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Valid array of color IDs is required",
      };
    }

    const deletedColors = await db
      .delete(colorTables)
      .where(inArray(colorTables.id, ids))
      .returning({ id: colorTables.id });

    return res.status(200).json({
      success: true,
      message: `${deletedColors.length} colors deleted successfully`,
      data: deletedColors,
    });
  } catch (error) {
    return handleError(error, res, COLOR_ENDPOINTS.DELETE_COLOR);
  }
};
