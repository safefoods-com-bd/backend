import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import productsTables from "@/db/schema/product-management/products/products";
import {
  deleteProductValidationSchema,
  batchDeleteProductValidationSchema,
} from "../products.validation";
import { eq, inArray } from "drizzle-orm";
import { PRODUCT_ENDPOINTS } from "@/data/endpoints";

/**
 * Deletes a single product record from the database
 *
 * @async
 * @function deleteProductSingleV100
 * @param {Request} req - Express request object containing product id in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response indicating deletion success
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 * @throws {Object} Throws an error object with type NOT_FOUND if product with provided id does not exist
 *
 * @description
 * This controller handles DELETE requests to delete a single product record.
 * It validates the incoming request body against deleteProductValidationSchema.
 * If validation passes, it deletes the product record with the provided id.
 * Returns a 200 status with a success message on successful deletion.
 */
export const deleteProductSingleV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = deleteProductValidationSchema.safeParse(req.body);

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { id } = validation.data;

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(productsTables)
      .where(eq(productsTables.id, id));

    if (existingProduct.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Product not found",
      };
    }

    // Use soft delete by setting isDeleted flag to true
    await db
      .update(productsTables)
      .set({ isDeleted: true })
      .where(eq(productsTables.id, id));

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return handleError(error, res, PRODUCT_ENDPOINTS.DELETE_PRODUCT);
  }
};

/**
 * Deletes multiple product records from the database in a batch operation
 *
 * @async
 * @function deleteProductBatchV100
 * @param {Request} req - Express request object containing array of product ids in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response indicating deletion success
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 *
 * @description
 * This controller handles DELETE requests to delete multiple product records in a batch.
 * It validates the incoming request body against batchDeleteProductValidationSchema.
 * If validation passes, it deletes all product records with the provided ids.
 * Returns a 200 status with a success message on successful deletion.
 */
export const deleteProductBatchV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = batchDeleteProductValidationSchema.safeParse(req.body);

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { ids } = validation.data;

    // Use soft delete by setting isDeleted flag to true
    await db
      .update(productsTables)
      .set({ isDeleted: true })
      .where(inArray(productsTables.id, ids));

    return res.status(200).json({
      success: true,
      message: "Products deleted successfully",
    });
  } catch (error) {
    return handleError(error, res, PRODUCT_ENDPOINTS.DELETE_PRODUCTS_BATCH);
  }
};
