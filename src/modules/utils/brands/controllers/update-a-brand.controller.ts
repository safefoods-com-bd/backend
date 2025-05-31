import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import brandTables from "@/db/schema/utils/brands";
import { updateBrandValidationSchema } from "../brands.validation";
import { eq } from "drizzle-orm";
import { BRAND_ENDPOINTS } from "@/data/endpoints";

/**
 * Updates an existing brand record in the database
 *
 * @async
 * @function updateBrandV100
 * @param {Request} req - Express request object containing brand data in the body with id
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response with the updated brand data
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 * @throws {Object} Throws an error object with type NOT_FOUND if brand with provided id does not exist
 *
 * @description
 * This controller handles PATCH requests to update brand records.
 * It validates the incoming request body against updateBrandValidationSchema.
 * If validation passes, it updates the brand record with the provided data.
 * Returns a 200 status with the updated brand record on success.
 */
export const updateBrandV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = updateBrandValidationSchema.safeParse(req.body);

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { id, ...updateData } = validation.data;

    // Check if brand exists
    const existingBrand = await db
      .select()
      .from(brandTables)
      .where(eq(brandTables.id, id));

    if (existingBrand.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Brand not found",
      };
    }

    // Check if title exists (if title update is requested)
    if (updateData.title) {
      const duplicateTitle = await db
        .select()
        .from(brandTables)
        .where(eq(brandTables.title, updateData.title));

      if (
        duplicateTitle.length > 0 &&
        duplicateTitle[0].id !== existingBrand[0].id
      ) {
        throw {
          type: ERROR_TYPES.VALIDATION,
          message: "Brand with the same title already exists",
        };
      }
    }

    // Update brand
    const updatedBrand = await db
      .update(brandTables)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(brandTables.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: updatedBrand[0],
    });
  } catch (error) {
    return handleError(error, res, BRAND_ENDPOINTS.UPDATE_BRAND);
  }
};

/**
 * Express request handler (exports as PATCH for semantic name resolution)
 */
export const PATCH = updateBrandV100;
