import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { eq, or } from "drizzle-orm";
import colorTables from "@/db/schema/utils/colors";
import { updateColorValidationSchema } from "../colors.validation";
import { COLOR_ENDPOINTS } from "@/data/endpoints";

/**
 * Updates a color record in the database.
 *
 * @async
 * @function PATCH
 * @param {Request} req - Express request object containing the color update data in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response with the updated color data
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 * @throws {Object} Throws an error object with type NOT_FOUND if color with the given id doesn't exist
 *
 * @description
 * This controller handles PATCH requests to update color records.
 * It validates the incoming request body against updateColorValidationSchema.
 * If validation passes, it updates the color record with the provided fields.
 * Only fields that are provided in the request are updated (partial update).
 * Returns a 200 status with the updated color record on success.
 */
export const PATCH = async (req: Request, res: Response): Promise<Response> => {
  try {
    const validation = updateColorValidationSchema.safeParse(await req.body);
    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }
    const { id, title, colorCode } = validation.data;

    // Check for existing color with the same title or colorCode (excluding the current record)
    const conditions = [];
    if (title) conditions.push(eq(colorTables.title, title));
    if (colorCode) conditions.push(eq(colorTables.colorCode, colorCode));

    const existingColor =
      conditions.length > 0
        ? await db
            .select()
            .from(colorTables)
            .where(or(...conditions))
        : [];

    if (existingColor.length > 0) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Color with the same title or code already exists",
      };
    }

    // Update color record
    const updatedColor = await db
      .update(colorTables)
      .set({
        ...(title && { title }),
        ...(colorCode && { colorCode }),
      })
      .where(eq(colorTables.id, id))
      .returning();

    if (updatedColor.length === 0) {
      throw { type: ERROR_TYPES.NOT_FOUND, message: "Color not found" };
    }

    return res.status(200).json({
      success: true,
      message: "Color updated successfully",
      data: updatedColor[0],
    });
  } catch (error) {
    return handleError(error, res, COLOR_ENDPOINTS.UPDATE_COLOR);
  }
};
