import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import productsTables from "@/db/schema/product-management/products/products";
import { eq } from "drizzle-orm";
import { PRODUCT_ENDPOINTS } from "@/data/endpoints";
import categoriesTable from "@/db/schema/product-management/categories/categories";
import brandTables from "@/db/schema/utils/brands";

/**
 * Gets a single product by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
export const getSingleProductV100 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Product ID is required",
      };
    }

    const product = await db
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
      .where(eq(productsTables.id, id));

    if (product.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Product not found",
      };
    }

    return res.status(200).json({
      success: true,
      data: product[0],
      message: "Product fetched successfully",
    });
  } catch (error) {
    handleError(error, res, PRODUCT_ENDPOINTS.GET_SINGLE_PRODUCT);
  }
};
