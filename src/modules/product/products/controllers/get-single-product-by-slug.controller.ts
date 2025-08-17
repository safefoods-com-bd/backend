import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import productsTables from "@/db/schema/product-management/products/products";
import { eq, sql } from "drizzle-orm";
import { PRODUCT_ENDPOINTS } from "@/data/endpoints";
import categoriesTable from "@/db/schema/product-management/categories/categories";
import brandTables from "@/db/schema/utils/brands";
import { variantProductsMediaTables, variantProductsTable } from "@/db/schema";
import colorTables from "@/db/schema/utils/colors";
import unitsTable from "@/db/schema/utils/units";
import variantProductTables from "@/db/schema/product-management/products/variant_products";
import mediaTables from "@/db/schema/utils/media";

/**
 * Gets a single product by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
export const getSingleProductBySlugV100 = async (
  req: Request,
  res: Response,
) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Product slug is required",
      };
    }

    // Fetch the product (no join to variants)
    const productResult = await db
      .select({
        id: productsTables.id,
        title: productsTables.title,
        slug: productsTables.slug,
        sku: productsTables.sku,
        season: productsTables.season,
        isActive: productsTables.isActive,
        isDeleted: productsTables.isDeleted,
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
      .leftJoin(brandTables, eq(productsTables.brandId, brandTables.id))
      .where(eq(productsTables.slug, slug));

    if (productResult.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Product not found",
      };
    }

    const product = productResult[0];

    // Fetch variants for this product (with color/unit info)
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
      .leftJoin(colorTables, eq(variantProductTables.colorId, colorTables.id))
      .leftJoin(unitsTable, eq(variantProductTables.unitId, unitsTable.id))
      .where(eq(variantProductTables.productId, product.id));

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

    // Attach variants to product
    const productWithVariants = {
      ...product,
      variants: variantsWithMedia || [],
    };

    return res.status(200).json({
      success: true,
      data: productWithVariants,
      message: "Product fetched successfully",
    });
  } catch (error) {
    handleError(error, res, PRODUCT_ENDPOINTS.GET_SINGLE_PRODUCT);
  }
};
