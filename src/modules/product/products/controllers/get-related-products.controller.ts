import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import productsTables from "@/db/schema/product-management/products/products";
import { and, eq, ne, sql } from "drizzle-orm";
import { PRODUCT_ENDPOINTS } from "@/data/endpoints";
import categoriesTable from "@/db/schema/product-management/categories/categories";
import brandTables from "@/db/schema/utils/brands";
import {
  stockTable,
  variantProductsMediaTables,
  variantProductsTable,
} from "@/db/schema";
import colorTables from "@/db/schema/utils/colors";
import unitsTable from "@/db/schema/utils/units";
import variantProductTables from "@/db/schema/product-management/products/variant_products";
import mediaTables from "@/db/schema/utils/media";
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
 * Gets a single product by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
export const getRelatedProductsV100 = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Product slug is required",
      };
    }

    //get category ID of the current product
    const currentProduct = await db
      .select({
        id: productsTables.id,
        categoryId: productsTables.categoryId,
      })
      .from(productsTables)
      .where(eq(productsTables.slug, slug))
      .limit(1)
      .execute();

    // get the other products of the same category except the current product
    const relatedProducts = await db
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
        categorySlug: categoriesTable.slug,
        brandTitle: brandTables.title,
      })
      .from(productsTables)
      .leftJoin(
        categoriesTable,
        eq(productsTables.categoryId, categoriesTable.id),
      )
      .leftJoin(brandTables, eq(productsTables.brandId, brandTables.id))
      .where(
        and(
          eq(categoriesTable.id, currentProduct[0]?.categoryId),
          ne(productsTables.slug, slug),
          eq(productsTables.isActive, true),
          eq(productsTables.isDeleted, false),
        ),
      );

    // Now fetch variant products for each product
    const productsWithVariants = await Promise.all(
      relatedProducts.map(async (product: Product) => {
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
            sql`${eq(variantProductTables.productId, product.id)} AND ${eq(variantProductTables.isDeleted, false)}`,
          );

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

    return res.status(200).json({
      success: true,
      data: productsWithVariants,
      message: "Product fetched successfully",
    });
  } catch (error) {
    handleError(error, res, PRODUCT_ENDPOINTS.GET_SINGLE_PRODUCT);
  }
};
