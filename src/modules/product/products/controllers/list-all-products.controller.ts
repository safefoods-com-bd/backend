import { Request, Response } from "express";
import { db } from "@/db/db";
import { handleError } from "@/utils/errorHandler";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { PRODUCT_ENDPOINTS } from "@/data/endpoints";
import productsTables from "@/db/schema/product-management/products/products";
import categoriesTable from "@/db/schema/product-management/categories/categories";
import brandTables from "@/db/schema/utils/brands";
import variantProductTables from "@/db/schema/product-management/products/variant_products";
import variantProductsMediaTables from "@/db/schema/product-management/products/variant_products_media";
import colorTables from "@/db/schema/utils/colors";
import unitsTable from "@/db/schema/utils/units";
import mediaTables from "@/db/schema/utils/media";
import { stockTable } from "@/db/schema";

// Define product interface for type checking
interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  season: string | null;
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
// This controller uses inline sorting instead of the helper function

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
    const bestDeal = req.query.bestDeal ? true : false;
    const discountedSale = req.query.discountedSale ? true : false;

    // First, build a subquery to find matching product IDs
    let matchingProductIdsQuery;

    if (search) {
      // When searching, find products that match directly OR have matching variants
      matchingProductIdsQuery = db
        .selectDistinct({ id: productsTables.id })
        .from(productsTables)
        .leftJoin(
          variantProductTables,
          eq(productsTables.id, variantProductTables.productId),
        )
        .where(
          sql`${eq(productsTables.isDeleted, false)} AND (
            ${productsTables.title} ILIKE ${"%" + search + "%"} OR 
            ${productsTables.sku} ILIKE ${"%" + search + "%"} OR
            ${productsTables.season} ILIKE ${"%" + search + "%"} OR
            ${variantProductTables.description} ILIKE ${"%" + search + "%"} OR
            ${variantProductTables.shortDescription} ILIKE ${"%" + search + "%"}
          )`,
        );
    } else {
      // When not searching, just get non-deleted products
      matchingProductIdsQuery = db
        .select({ id: productsTables.id })
        .from(productsTables)
        .where(eq(productsTables.isDeleted, false));
    }

    // Get the count of matching products
    const countResult = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(matchingProductIdsQuery.as("matching_products"));

    const countValue = countResult[0]?.count || 0;

    // Now get the actual products with all their details
    const productIdsSubquery = matchingProductIdsQuery.as(
      "matching_product_ids",
    );

    const products = await db
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
        categorySlug: categoriesTable.slug,
        brandTitle: brandTables.title,
      })
      .from(productsTables)
      .innerJoin(
        productIdsSubquery,
        eq(productsTables.id, productIdsSubquery.id),
      )
      .leftJoin(
        categoriesTable,
        eq(productsTables.categoryId, categoriesTable.id),
      )
      .leftJoin(brandTables, eq(productsTables.brandId, brandTables.id))
      .orderBy(
        sortBy === "title"
          ? sortOrder.toLowerCase() === "asc"
            ? asc(productsTables.title)
            : desc(productsTables.title)
          : sortBy === "updatedAt"
            ? sortOrder.toLowerCase() === "asc"
              ? asc(productsTables.updatedAt)
              : desc(productsTables.updatedAt)
            : sortBy === "id"
              ? sortOrder.toLowerCase() === "asc"
                ? asc(productsTables.id)
                : desc(productsTables.id)
              : sortBy === "sku"
                ? sortOrder.toLowerCase() === "asc"
                  ? asc(productsTables.sku)
                  : desc(productsTables.sku)
                : sortOrder.toLowerCase() === "asc"
                  ? asc(productsTables.createdAt)
                  : desc(productsTables.createdAt),
      )
      .limit(limit)
      .offset(offset);

    // Now fetch variant products for each product
    const productsWithVariants = await Promise.all(
      products.map(async (product: Product) => {
        // First get the variants
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
            stock: stockTable.quantity,
          })
          .from(variantProductTables)
          .leftJoin(
            colorTables,
            eq(variantProductTables.colorId, colorTables.id),
          )
          .leftJoin(unitsTable, eq(variantProductTables.unitId, unitsTable.id))
          .leftJoin(
            stockTable,
            eq(variantProductTables.id, stockTable.variantProductId),
          )
          .where(
            and(
              eq(variantProductTables.productId, product.id),
              eq(variantProductTables.isDeleted, false),
              eq(variantProductTables.bestDeal, bestDeal),
              eq(variantProductTables.discountedSale, discountedSale),
            ),
          );
        // .where(
        //   sql`${eq(variantProductTables.productId, product.id)} AND ${eq(variantProductTables.isDeleted, false)}`,
        // );

        // Then for each variant, fetch its media
        const variantsWithMedia = await Promise.all(
          variants.map(async (variant) => {
            const mediaItems = await db
              .select({
                id: variantProductsMediaTables.id,
                mediaId: variantProductsMediaTables.mediaId,
                mediaUrl: mediaTables.url,
                mediaTitle: mediaTables.title,
              })
              .from(variantProductsMediaTables)
              .leftJoin(
                mediaTables,
                eq(variantProductsMediaTables.mediaId, mediaTables.id),
              )
              .where(
                sql`${eq(variantProductsMediaTables.variantProductId, variant.id)} AND ${eq(variantProductsMediaTables.isDeleted, false)}`,
              );

            return {
              ...variant,
              mediaItems: mediaItems || [],
            };
          }),
        );

        return {
          ...product,
          variants: variantsWithMedia,
        };
      }),
    );

    const pagination = {
      page,
      limit,
      totalRecords: Number(countValue),
      totalPages: Math.ceil(countValue / limit),
    };

    const filteredProducts = productsWithVariants.filter(
      (product) => product.variants && product.variants.length > 0,
    );

    return res.status(200).json({
      success: true,
      message: "Products with variants retrieved successfully",
      data: filteredProducts,
      pagination,
    });
  } catch (error) {
    return handleError(error, res, PRODUCT_ENDPOINTS.LIST_ALL_PRODUCTS);
  }
};
