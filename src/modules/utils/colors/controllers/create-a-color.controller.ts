import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import colorTables from "@/db/schema/utils/colors";
import { colorValidationSchema } from "../colors.validation";
import { eq, or } from "drizzle-orm";
import { COLOR_ENDPOINTS } from "@/data/endpoints";

/**
 * Creates a new color record in the database
 *
 * @async
 * @function createColorV100
 * @param {Request} req - Express request object containing color data in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response with the created color data
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 *
 * @description
 * This controller handles POST requests to create new color records.
 * It validates the incoming request body against colorValidationSchema.
 * If validation passes, it creates a new color record with the provided title and color code.
 * Returns a 201 status with the created color record on success.
 */
export const createColorV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = colorValidationSchema.safeParse(req.body);

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { title, colorCode } = validation.data;

    // Check for existing color
    const existingColor = await db
      .select()
      .from(colorTables)
      .where(
        or(eq(colorTables.title, title), eq(colorTables.colorCode, colorCode)),
      );

    if (existingColor.length > 0) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Color with the same title or code already exists",
      };
    }

    // Create color record
    const newColor = await db
      .insert(colorTables)
      .values({
        title,
        colorCode,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Color created successfully",
      data: newColor[0],
    });
  } catch (error) {
    return handleError(error, res, COLOR_ENDPOINTS.CREATE_COLOR);
  }
};
