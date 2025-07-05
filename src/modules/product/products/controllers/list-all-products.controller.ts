import { Request, Response } from "express";
import { db } from "@/db/db";
import { handleError } from "@/utils/errorHandler";
import { asc, desc, eq, sql } from "drizzle-orm";
import { PRODUCT_ENDPOINTS } from "@/data/endpoints";
import productsTables from "@/db/schema/product-management/products/products";
import categoriesTable from "@/db/schema/product-management/categories/categories";
import brandTables from "@/db/schema/utils/brands";
import variantProductTables from "@/db/schema/product-management/products/variant_products";
import colorTables from "@/db/schema/utils/colors";
import unitsTable from "@/db/schema/utils/units";

// Define product interface for type checking
interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  season: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  brandId: string | null;
  categoryTitle: string | null;
  brandTitle: string | null;
}

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

    // Build the select query for products
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

    // Apply search filter if provided
    let filteredQuery;
    let countResult;
    let countValue;

    if (search) {
      const searchQuery = sql`${productsTables.title} LIKE ${"%" + search + "%"} OR 
                              ${productsTables.sku} LIKE ${"%" + search + "%"} OR
                              ${productsTables.season} LIKE ${"%" + search + "%"}`;

      filteredQuery = selectQueryBuilder.where(
        sql`${eq(productsTables.isDeleted, false)} AND (${searchQuery})`,
      );

      // Count with search filter
      countResult = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(productsTables)
        .where(
          sql`${eq(productsTables.isDeleted, false)} AND (${searchQuery})`,
        );

      countValue = countResult[0]?.count || 0;
    } else {
      // No search filter
      filteredQuery = selectQueryBuilder.where(
        eq(productsTables.isDeleted, false),
      );

      countResult = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(productsTables)
        .where(eq(productsTables.isDeleted, false));

      countValue = countResult[0]?.count || 0;
    }

    // Apply sorting and fetch the products
    const products = await applySorting(filteredQuery, sortBy, sortOrder)
      .limit(limit)
      .offset(offset);

    // Now fetch variant products for each product
    const productsWithVariants = await Promise.all(
      products.map(async (product: Product) => {
        const variants = await db
          .select({
            id: variantProductTables.id,
            price: variantProductTables.price,
            originalPrice: variantProductTables.originalPrice,
            description: variantProductTables.description,
            shortDescription: variantProductTables.shortDescription,
            bestDeal: variantProductTables.bestDeal,
            discountedSale: variantProductTables.discountedSale,
            isActive: variantProductTables.isActive,
            createdAt: variantProductTables.createdAt,
            updatedAt: variantProductTables.updatedAt,
            colorId: variantProductTables.colorId,
            unitId: variantProductTables.unitId,
            colorTitle: colorTables.title,
            unitTitle: unitsTable.title,
          })
          .from(variantProductTables)
          .leftJoin(
            colorTables,
            eq(variantProductTables.colorId, colorTables.id),
          )
          .leftJoin(unitsTable, eq(variantProductTables.unitId, unitsTable.id))
          .where(
            sql`${eq(variantProductTables.productId, product.id)} AND ${eq(variantProductTables.isDeleted, false)}`,
          );

        return {
          ...product,
          variants,
        };
      }),
    );

    const pagination = {
      page,
      limit,
      totalRecords: Number(countValue),
      totalPages: Math.ceil(countValue / limit),
    };

    return res.status(200).json({
      success: true,
      message: "Products with variants retrieved successfully",
      data: productsWithVariants,
      pagination,
    });
  } catch (error) {
    return handleError(error, res, PRODUCT_ENDPOINTS.LIST_ALL_PRODUCTS);
  }
};
