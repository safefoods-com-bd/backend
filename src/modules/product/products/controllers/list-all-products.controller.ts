import { Request, Response } from "express";
import { db } from "@/db/db";
import { handleError } from "@/utils/errorHandler";
import { asc, desc, eq, sql } from "drizzle-orm";
import { PRODUCT_ENDPOINTS } from "@/data/endpoints";
import productsTables from "@/db/schema/product-management/products/products";
import categoriesTable from "@/db/schema/product-management/categories/categories";
import brandTables from "@/db/schema/utils/brands";

/**
 * Lists all product records from the database with optional filtering and pagination
 *
 * @async
 * @function listAllProductsV100
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} A Promise resolving to a response with a list of products
 *
 * @description
 * This controller handles GET requests to list all product records.
 * It supports optional query parameters for sorting and pagination.
 * Returns a 200 status with the list of products on success.
 */
// Helper function to apply sorting
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applySorting(query: any, sortBy: string, sortOrder: string) {
  const isAsc = sortOrder.toLowerCase() === "asc";

  switch (sortBy) {
    case "title":
      return query.orderBy(
        isAsc ? asc(productsTables.title) : desc(productsTables.title),
      );
    case "updatedAt":
      return query.orderBy(
        isAsc ? asc(productsTables.updatedAt) : desc(productsTables.updatedAt),
      );
    case "id":
      return query.orderBy(
        isAsc ? asc(productsTables.id) : desc(productsTables.id),
      );
    case "sku":
      return query.orderBy(
        isAsc ? asc(productsTables.sku) : desc(productsTables.sku),
      );
    case "createdAt":
    default:
      return query.orderBy(
        isAsc ? asc(productsTables.createdAt) : desc(productsTables.createdAt),
      );
  }
}

export const listAllProductsV100 = async (
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
        id: productsTables.id,
        title: productsTables.title,
        slug: productsTables.slug,
        sku: productsTables.sku,
        season: productsTables.season,
        isActive: productsTables.isActive,
        createdAt: productsTables.createdAt,
        updatedAt: productsTables.updatedAt,
        categoryId: productsTables.categoryId,
        brandId: productsTables.brandId,
        categoryTitle: categoriesTable.title,
        brandTitle: brandTables.title,
      })
      .from(productsTables)
      .leftJoin(
        categoriesTable,
        eq(productsTables.categoryId, categoriesTable.id),
      )
      .leftJoin(brandTables, eq(productsTables.brandId, brandTables.id));
    //   .where(eq(productsTables.isDeleted, false));

    // Apply search filter if provided
    if (search) {
      const searchQuery = sql`${productsTables.title} LIKE ${"%" + search + "%"} OR 
                              ${productsTables.sku} LIKE ${"%" + search + "%"} OR
                              ${productsTables.season} LIKE ${"%" + search + "%"}`;

      const filteredQuery = selectQueryBuilder.where(
        sql`${eq(productsTables.isDeleted, false)} AND (${searchQuery})`,
      );

      // Count with search filter
      const countResult = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(productsTables)
        .where(searchQuery);

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
        message: "Products retrieved successfully",
        data: results,
        meta: pagination,
      });
    } else {
      // No search filter
      const countResult = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(productsTables)
        .where(eq(productsTables.isDeleted, false));

      const countValue = countResult[0]?.count || 0;

      // Apply sorting
      const results = await applySorting(
        selectQueryBuilder.where(eq(productsTables.isDeleted, false)),
        sortBy,
        sortOrder,
      )
        .limit(limit)
        .offset(offset);

      return res.status(200).json({
        success: true,
        message: "Products retrieved successfully",
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
    return handleError(error, res, PRODUCT_ENDPOINTS.LIST_ALL_PRODUCTS);
  }
};
