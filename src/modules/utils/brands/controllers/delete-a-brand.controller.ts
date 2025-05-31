import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import brandTables from "@/db/schema/utils/brands";
import {
  deleteBrandValidationSchema,
  batchDeleteBrandValidationSchema,
} from "../brands.validation";
import { eq, inArray } from "drizzle-orm";
import { BRAND_ENDPOINTS } from "@/data/endpoints";

/**
 * Deletes a single brand record from the database
 *
 * @async
 * @function deleteBrandSingleV100
 * @param {Request} req - Express request object containing brand id in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response indicating deletion success
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 * @throws {Object} Throws an error object with type NOT_FOUND if brand with provided id does not exist
 *
 * @description
 * This controller handles DELETE requests to delete a single brand record.
 * It validates the incoming request body against deleteBrandValidationSchema.
 * If validation passes, it deletes the brand record with the provided id.
 * Returns a 200 status with a success message on successful deletion.
 */
export const deleteBrandSingleV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = deleteBrandValidationSchema.safeParse(req.body);

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { id } = validation.data;

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

    // Delete brand
    await db.delete(brandTables).where(eq(brandTables.id, id));

    return res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    return handleError(error, res, BRAND_ENDPOINTS.DELETE_BRAND);
  }
};

/**
 * Deletes multiple brand records from the database in a batch operation
 *
 * @async
 * @function deleteBrandBatchV100
 * @param {Request} req - Express request object containing array of brand ids in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response indicating deletion success
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 *
 * @description
 * This controller handles DELETE requests to delete multiple brand records in a batch.
 * It validates the incoming request body against batchDeleteBrandValidationSchema.
 * If validation passes, it deletes all brand records with the provided ids.
 * Returns a 200 status with a success message on successful deletion.
 */
export const deleteBrandBatchV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = batchDeleteBrandValidationSchema.safeParse(req.body);

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { ids } = validation.data;

    // Delete brands
    await db.delete(brandTables).where(inArray(brandTables.id, ids));

    return res.status(200).json({
      success: true,
      message: "Brands deleted successfully",
    });
  } catch (error) {
    return handleError(error, res, BRAND_ENDPOINTS.DELETE_BRAND);
  }
};
