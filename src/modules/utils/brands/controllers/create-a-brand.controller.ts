import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import brandTables from "@/db/schema/utils/brands";
import { brandValidationSchema } from "../brands.validation";
import { eq } from "drizzle-orm";
import { BRAND_ENDPOINTS } from "@/data/endpoints";

/**
 * Creates a new brand record in the database
 *
 * @async
 * @function createBrandV100
 * @param {Request} req - Express request object containing brand data in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response with the created brand data
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 *
 * @description
 * This controller handles POST requests to create new brand records.
 * It validates the incoming request body against brandValidationSchema.
 * If validation passes, it creates a new brand record with the provided title.
 * Returns a 201 status with the created brand record on success.
 */
export const createBrandV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = brandValidationSchema.safeParse(req.body);

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { title } = validation.data;

    // Check for existing brand with same title
    const existingBrand = await db
      .select()
      .from(brandTables)
      .where(eq(brandTables.title, title));

    if (existingBrand.length > 0) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Brand with the same title already exists",
      };
    }

    // Create brand record
    const newBrand = await db.insert(brandTables).values({ title }).returning();

    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: newBrand[0],
    });
  } catch (error) {
    return handleError(error, res, BRAND_ENDPOINTS.CREATE_BRAND);
  }
};
