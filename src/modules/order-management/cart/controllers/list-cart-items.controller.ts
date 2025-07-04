import { Request, Response } from "express";
import { db } from "@/db/db";
import { handleError } from "@/utils/errorHandler";
import { asc, desc, eq, sql } from "drizzle-orm";
import addedToCartsTable from "@/db/schema/order-management/added_to_carts";
import { CART_ENDPOINTS } from "@/data/endpoints";
import variantProductTables from "@/db/schema/product-management/products/variant_products";

/**
 * Lists all cart items from the database with optional filtering and pagination
 *
 * @async
 * @function listCartItemsV100
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} A Promise resolving to a response with a list of cart items
 *
 * @description
 * This controller handles GET requests to list cart items.
 * It supports optional query parameters for filtering by userId, sorting and pagination.
 * Returns a 200 status with the list of cart items on success.
 */
export const listCartItemsV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const offset = (page - 1) * limit;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as string) || "desc";
    const userId = req.query.userId as string;

    let cartItems = [];
    let totalItems = 0;

    // Handle filtering by userId if provided
    if (userId) {
      const userFilter = eq(addedToCartsTable.userId, userId);

      // Get filtered cart items
      cartItems = await db
        .select()
        .from(addedToCartsTable)
        .where(userFilter)
        .limit(limit)
        .offset(offset)
        .orderBy(
          sortBy === "createdAt"
            ? sortOrder === "asc"
              ? asc(addedToCartsTable.createdAt)
              : desc(addedToCartsTable.createdAt)
            : sortBy === "quantity"
              ? sortOrder === "asc"
                ? asc(addedToCartsTable.quantity)
                : desc(addedToCartsTable.quantity)
              : desc(addedToCartsTable.createdAt),
        );

      // Count filtered items
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(addedToCartsTable)
        .where(userFilter);

      totalItems = Number(countResult[0]?.count || 0);
    } else {
      // Get all cart items
      cartItems = await db
        .select()
        .from(addedToCartsTable)
        .limit(limit)
        .offset(offset)
        .orderBy(
          sortBy === "createdAt"
            ? sortOrder === "asc"
              ? asc(addedToCartsTable.createdAt)
              : desc(addedToCartsTable.createdAt)
            : sortBy === "quantity"
              ? sortOrder === "asc"
                ? asc(addedToCartsTable.quantity)
                : desc(addedToCartsTable.quantity)
              : desc(addedToCartsTable.createdAt),
        );

      // Count all items
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(addedToCartsTable);

      totalItems = Number(countResult[0]?.count || 0);
    }

    // Get product information for each cart item
    const cartItemsWithProductInfo = await Promise.all(
      cartItems.map(async (item) => {
        if (!item.variantProductId) {
          return { ...item, productPrice: 0 };
        }

        const productInfo = await db
          .select({ price: variantProductTables.price })
          .from(variantProductTables)
          .where(eq(variantProductTables.id, item.variantProductId as string))
          .limit(1);

        return {
          ...item,
          productPrice: productInfo[0]?.price || 0,
        };
      }),
    );

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      success: true,
      message: "Cart items retrieved successfully",
      data: {
        items: cartItemsWithProductInfo,
        meta: {
          totalItems,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    return handleError(error, res, CART_ENDPOINTS.LIST_CART_ITEMS);
  }
};
