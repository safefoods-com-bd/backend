import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { eq } from "drizzle-orm";
import addedToCartsTable from "@/db/schema/order-management/added_to_carts";
import { updateCartValidationSchema } from "../cart.validation";
import { CART_ENDPOINTS } from "@/data/endpoints";

/**
 * Updates a cart item in the database.
 *
 * @async
 * @function updateCartItemV100
 * @param {Request} req - Express request object containing the cart item update data in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response with the updated cart item data
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 * @throws {Object} Throws an error object with type NOT_FOUND if cart item with the given id doesn't exist
 *
 * @description
 * This controller handles PATCH requests to update cart item records.
 * It validates the incoming request body against updateCartValidationSchema.
 * If validation passes, it updates the cart item record with the provided fields.
 * Only fields that are provided in the request are updated (partial update).
 * Returns a 200 status with the updated cart item record on success.
 */
export const updateCartItemV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const validation = updateCartValidationSchema.safeParse(req.body);
    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const {
      id,
      userId,
      variantProductId,
      quantity,
      addedToCheckOut,
      isPurchased,
      isDiscarded,
    } = validation.data;

    // Prepare update data, only include fields that are provided
    const updateData: Partial<{
      userId: string;
      variantProductId: string;
      quantity: number;
      addedToCheckOut: boolean;
      isPurchased: boolean;
      isDiscarded: boolean;
      updatedAt: Date;
    }> = {};

    if (userId !== undefined) updateData.userId = userId;
    if (variantProductId !== undefined)
      updateData.variantProductId = variantProductId;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (addedToCheckOut !== undefined)
      updateData.addedToCheckOut = addedToCheckOut;
    if (isPurchased !== undefined) updateData.isPurchased = isPurchased;
    if (isDiscarded !== undefined) updateData.isDiscarded = isDiscarded;

    // Add updated timestamp
    updateData.updatedAt = new Date();

    // Update cart item record
    const updatedCartItem = await db
      .update(addedToCartsTable)
      .set(updateData)
      .where(eq(addedToCartsTable.id, id))
      .returning();

    if (updatedCartItem.length === 0) {
      throw { type: ERROR_TYPES.NOT_FOUND, message: "Cart item not found" };
    }

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: updatedCartItem[0],
    });
  } catch (error) {
    return handleError(error, res, CART_ENDPOINTS.UPDATE_CART_ITEM);
  }
};
