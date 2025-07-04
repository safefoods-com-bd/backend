import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { eq, inArray } from "drizzle-orm";
import addedToCartsTable from "@/db/schema/order-management/added_to_carts";
import {
  batchDeleteCartValidationSchema,
  deleteCartValidationSchema,
} from "../cart.validation";
import { CART_ENDPOINTS } from "@/data/endpoints";

/**
 * Deletes a cart item from the database.
 *
 * @async
 * @function deleteCartSingleV100
 * @param {Request} req - Express request object containing the cart item ID
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response confirming deletion
 *
 * @throws {Object} Throws an error object with type VALIDATION if id validation fails
 * @throws {Object} Throws an error object with type NOT_FOUND if cart item with the given id doesn't exist
 *
 * @description
 * This controller handles DELETE requests to remove a cart item.
 * It validates the id parameter from the request.
 * If validation passes, it deletes the cart item with the specified id.
 * Returns a 200 status with a success message on successful deletion.
 */
export const deleteCartSingleV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const validation = deleteCartValidationSchema.safeParse(req.params);
    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { id } = validation.data;

    // Delete the cart item
    const deletedCartItem = await db
      .delete(addedToCartsTable)
      .where(eq(addedToCartsTable.id, id))
      .returning();

    if (deletedCartItem.length === 0) {
      throw { type: ERROR_TYPES.NOT_FOUND, message: "Cart item not found" };
    }

    return res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
    });
  } catch (error) {
    return handleError(error, res, CART_ENDPOINTS.DELETE_CART_ITEM);
  }
};

/**
 * Deletes multiple cart items from the database.
 *
 * @async
 * @function deleteCartBatchV100
 * @param {Request} req - Express request object containing array of cart item IDs
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response confirming deletion
 *
 * @throws {Object} Throws an error object with type VALIDATION if ids validation fails
 *
 * @description
 * This controller handles DELETE requests to remove multiple cart items in batch.
 * It validates the array of ids from the request body.
 * If validation passes, it deletes all cart items with the specified ids.
 * Returns a 200 status with the count of deleted items and a success message.
 */
export const deleteCartBatchV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const validation = batchDeleteCartValidationSchema.safeParse(req.body);
    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { ids } = validation.data;

    // Delete the cart items
    const deletedCartItems = await db
      .delete(addedToCartsTable)
      .where(inArray(addedToCartsTable.id, ids))
      .returning();

    return res.status(200).json({
      success: true,
      message: `${deletedCartItems.length} cart items deleted successfully`,
    });
  } catch (error) {
    return handleError(error, res, CART_ENDPOINTS.DELETE_CART_ITEMS_BATCH);
  }
};
