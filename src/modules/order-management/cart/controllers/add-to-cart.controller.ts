import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import addedToCartsTable from "@/db/schema/order-management/added_to_carts";
import variantProductTables from "@/db/schema/product-management/products/variant_products";
import { cartValidationSchema } from "../cart.validation";
import { CART_ENDPOINTS } from "@/data/endpoints";

/**
 * Adds an item to the cart
 *
 * @async
 * @function addToCartV100
 * @param {Request} req - Express request object containing the cart item data in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response with the created cart item data
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 * @throws {Object} Throws an error object with type NOT_FOUND if product with the given id doesn't exist
 *
 * @description
 * This controller handles POST requests to add items to a cart.
 * It validates the incoming request body against cartValidationSchema.
 * If validation passes, it adds the item to the cart after checking that the product exists.
 * Returns a 201 status with the created cart item on success.
 */
export const addToCartV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const validation = cartValidationSchema.safeParse(req.body);

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const {
      userId,
      variantProductId,
      quantity,
      addedToCheckOut,
      isPurchased,
      isDiscarded,
    } = validation.data;

    // Check if the variant product exists
    const productExists = await db
      .select()
      .from(variantProductTables)
      .where(eq(variantProductTables.id, variantProductId))
      .limit(1);

    if (productExists.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Product not found",
      };
    }

    // Check if this item is already in the cart for the user and not purchased or discarded
    const existingCartItem = await db
      .select()
      .from(addedToCartsTable)
      .where(
        and(
          eq(addedToCartsTable.userId, userId),
          eq(addedToCartsTable.variantProductId, variantProductId),
          eq(addedToCartsTable.isPurchased, false),
          eq(addedToCartsTable.isDiscarded, false),
        ),
      )
      .limit(1);

    if (existingCartItem.length > 0) {
      // Update quantity of existing cart item
      const updatedCartItem = await db
        .update(addedToCartsTable)
        .set({
          quantity: existingCartItem[0].quantity + quantity,
          updatedAt: new Date(),
        })
        .where(eq(addedToCartsTable.id, existingCartItem[0].id))
        .returning();

      return res.status(200).json({
        success: true,
        message: "Cart item quantity updated",
        data: updatedCartItem[0],
      });
    }

    // Add new item to cart
    const newCartItem = await db
      .insert(addedToCartsTable)
      .values({
        id: randomUUID(),
        userId,
        variantProductId,
        quantity,
        addedToCheckOut: addedToCheckOut || false,
        isPurchased: isPurchased || false,
        isDiscarded: isDiscarded || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: newCartItem[0],
    });
  } catch (error) {
    return handleError(error, res, CART_ENDPOINTS.ADD_TO_CART);
  }
};
