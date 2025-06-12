import { Request, Response } from "express";
import { db } from "@/db/db";
import { handleError } from "@/utils/errorHandler";
import { asc, desc, eq, sql } from "drizzle-orm";
import { VARIANT_PRODUCT_ENDPOINTS } from "@/data/endpoints";
import variantProductTables from "@/db/schema/product-management/products/variant_products";
import productsTables from "@/db/schema/product-management/products/products";
import colorTables from "@/db/schema/utils/colors";
import sizeTables from "@/db/schema/utils/sizes";
import unitsTable from "@/db/schema/utils/units";

/**
 * Lists all variant product records from the database with optional filtering and pagination
 *
 * @async
 * @function listAllVariantProductsV100
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} A Promise resolving to a response with a list of variant products
 *
 * @description
 * This controller handles GET requests to list all variant product records.
 * It supports optional query parameters for sorting and pagination.
 * Returns a 200 status with the list of variant products on success.
 */
// Helper function to apply sorting
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applySorting(query: any, sortBy: string, sortOrder: string) {
  const isAsc = sortOrder.toLowerCase() === "asc";

  switch (sortBy) {
    case "price":
      return query.orderBy(
        isAsc
          ? asc(variantProductTables.price)
          : desc(variantProductTables.price),
      );
    case "stock":
      return query.orderBy(
        isAsc
          ? asc(variantProductTables.stock)
          : desc(variantProductTables.stock),
      );
    case "updatedAt":
      return query.orderBy(
        isAsc
          ? asc(variantProductTables.updatedAt)
          : desc(variantProductTables.updatedAt),
      );
    case "id":
      return query.orderBy(
        isAsc ? asc(variantProductTables.id) : desc(variantProductTables.id),
      );
    case "createdAt":
    default:
      return query.orderBy(
        isAsc
          ? asc(variantProductTables.createdAt)
          : desc(variantProductTables.createdAt),
      );
  }
}

export const listAllVariantProductsV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const offset = (page - 1) * limit;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as string) || "desc";
    const search = req.query.search as string;

    // Build the select query
    const selectQueryBuilder = db
      .select({
        id: variantProductTables.id,
        price: variantProductTables.price,
        originalPrice: variantProductTables.originalPrice,
        stock: variantProductTables.stock,
        description: variantProductTables.description,
        shortDescription: variantProductTables.shortDescription,
        bestDeal: variantProductTables.bestDeal,
        discountedSale: variantProductTables.discountedSale,
        isActive: variantProductTables.isActive,
        createdAt: variantProductTables.createdAt,
        updatedAt: variantProductTables.updatedAt,
        productId: variantProductTables.productId,
        colorId: variantProductTables.colorId,
        sizeId: variantProductTables.sizeId,
        unitId: variantProductTables.unitId,
        productTitle: productsTables.title,
        colorName: colorTables.title,
        sizeName: sizeTables.title,
        unitName: unitsTable.title,
      })
      .from(variantProductTables)
      .leftJoin(
        productsTables,
        eq(variantProductTables.productId, productsTables.id),
      )
      .leftJoin(colorTables, eq(variantProductTables.colorId, colorTables.id))
      .leftJoin(sizeTables, eq(variantProductTables.sizeId, sizeTables.id))
      .leftJoin(unitsTable, eq(variantProductTables.unitId, unitsTable.id))
      .where(eq(variantProductTables.isDeleted, false));

    // Apply search filter if provided
    if (search) {
      const searchQuery = sql`${productsTables.title} LIKE ${"%" + search + "%"} OR 
                             ${variantProductTables.description} LIKE ${"%" + search + "%"} OR
                             ${variantProductTables.shortDescription} LIKE ${"%" + search + "%"}`;

      const filteredQuery = selectQueryBuilder.where(searchQuery);

      // Count with search filter
      const countResult = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(variantProductTables)
        .leftJoin(
          productsTables,
          eq(variantProductTables.productId, productsTables.id),
        )
        .where(searchQuery)
        .where(eq(variantProductTables.isDeleted, false));

      const countValue = countResult[0]?.count || 0;

      // Apply sorting
      const results = await applySorting(filteredQuery, sortBy, sortOrder)
        .limit(limit)
        .offset(offset);

      const pagination = {
        page,
        limit,
        totalRecords: countValue,
        totalPages: Math.ceil(countValue / limit),
      };

      return res.status(200).json({
        success: true,
        message: "Variant products retrieved successfully",
        data: results,
        meta: pagination,
      });
    } else {
      // No search filter
      const countResult = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(variantProductTables)
        .where(eq(variantProductTables.isDeleted, false));

      const countValue = countResult[0]?.count || 0;

      // Apply sorting
      const results = await applySorting(selectQueryBuilder, sortBy, sortOrder)
        .limit(limit)
        .offset(offset);

      return res.status(200).json({
        success: true,
        message: "Variant products retrieved successfully",
        data: results,
        pagination: {
          page,
          limit,
          totalRecords: Number(countValue),
          totalPages: Math.ceil(countValue / limit),
        },
      });
    }
  } catch (error) {
    return handleError(
      error,
      res,
      VARIANT_PRODUCT_ENDPOINTS.LIST_ALL_VARIANT_PRODUCTS,
    );
  }
};
