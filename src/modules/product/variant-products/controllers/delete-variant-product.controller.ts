import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import variantProductTables from "@/db/schema/product-management/products/variant_products";
import {
  deleteVariantProductValidationSchema,
  batchDeleteVariantProductValidationSchema,
} from "../variant-products.validation";
import { eq, inArray } from "drizzle-orm";
import { VARIANT_PRODUCT_ENDPOINTS } from "@/data/endpoints";

/**
 * Deletes a single variant product record from the database
 *
 * @async
 * @function deleteVariantProductSingleV100
 * @param {Request} req - Express request object containing variant product id in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response indicating deletion success
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 * @throws {Object} Throws an error object with type NOT_FOUND if variant product with provided id does not exist
 *
 * @description
 * This controller handles DELETE requests to delete a single variant product record.
 * It validates the incoming request body against deleteVariantProductValidationSchema.
 * If validation passes, it soft-deletes the variant product record with the provided id.
 * Returns a 200 status with a success message on successful deletion.
 */
export const deleteVariantProductSingleV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = deleteVariantProductValidationSchema.safeParse(req.body);

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { id } = validation.data;

    // Check if variant product exists
    const existingVariantProduct = await db
      .select()
      .from(variantProductTables)
      .where(eq(variantProductTables.id, id));

    if (existingVariantProduct.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Variant product not found",
      };
    }

    // Use soft delete by setting isDeleted flag to true
    await db
      .update(variantProductTables)
      .set({ isDeleted: true })
      .where(eq(variantProductTables.id, id));

    return res.status(200).json({
      success: true,
      message: "Variant product deleted successfully",
    });
  } catch (error) {
    return handleError(
      error,
      res,
      VARIANT_PRODUCT_ENDPOINTS.DELETE_VARIANT_PRODUCT,
    );
  }
};

/**
 * Deletes multiple variant product records from the database in a batch operation
 *
 * @async
 * @function deleteVariantProductBatchV100
 * @param {Request} req - Express request object containing array of variant product ids in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response indicating deletion success
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 *
 * @description
 * This controller handles DELETE requests to delete multiple variant product records in a batch.
 * It validates the incoming request body against batchDeleteVariantProductValidationSchema.
 * If validation passes, it soft-deletes all variant product records with the provided ids.
 * Returns a 200 status with a success message on successful deletion.
 */
export const deleteVariantProductBatchV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = batchDeleteVariantProductValidationSchema.safeParse(
      req.body,
    );

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { ids } = validation.data;

    // Use soft delete by setting isDeleted flag to true
    await db
      .update(variantProductTables)
      .set({ isDeleted: true })
      .where(inArray(variantProductTables.id, ids));

    return res.status(200).json({
      success: true,
      message: "Variant products deleted successfully",
    });
  } catch (error) {
    return handleError(
      error,
      res,
      VARIANT_PRODUCT_ENDPOINTS.DELETE_VARIANT_PRODUCTS_BATCH,
    );
  }
};
