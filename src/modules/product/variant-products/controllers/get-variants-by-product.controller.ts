import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import variantProductTables from "@/db/schema/product-management/products/variant_products";
import { and, eq } from "drizzle-orm";
import { VARIANT_PRODUCT_ENDPOINTS } from "@/data/endpoints";
import productsTables from "@/db/schema/product-management/products/products";
import colorTables from "@/db/schema/utils/colors";
import unitsTable from "@/db/schema/utils/units";
import { stockTable } from "@/db/schema";

/**
 * Gets variant products by product ID
 *
 * @param req Express request object
 * @param res Express response object
 */
export const getVariantProductsByProductV100 = async (
  req: Request,
  res: Response,
) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Product ID is required",
      };
    }

    // Check if the product exists
    const product = await db
      .select()
      .from(productsTables)
      .where(eq(productsTables.id, productId));

    if (product.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Product not found",
      };
    }

    // Get all variants for this product
    const variantProducts = await db
      .select({
        id: variantProductTables.id,
        price: variantProductTables.price,
        originalPrice: variantProductTables.originalPrice,
        stock: stockTable.quantity,
        description: variantProductTables.description,
        shortDescription: variantProductTables.shortDescription,
        bestDeal: variantProductTables.bestDeal,
        discountedSale: variantProductTables.discountedSale,
        isActive: variantProductTables.isActive,
        createdAt: variantProductTables.createdAt,
        updatedAt: variantProductTables.updatedAt,
        productId: variantProductTables.productId,
        colorId: variantProductTables.colorId,
        unitId: variantProductTables.unitId,
        productTitle: productsTables.title,
        colorName: colorTables.title,
        unitName: unitsTable.title,
      })
      .from(variantProductTables)
      .leftJoin(
        productsTables,
        eq(variantProductTables.productId, productsTables.id),
      )
      .leftJoin(colorTables, eq(variantProductTables.colorId, colorTables.id))
      .leftJoin(
        stockTable,
        eq(variantProductTables.id, stockTable.variantProductId),
      )
      .leftJoin(unitsTable, eq(variantProductTables.unitId, unitsTable.id))
      .where(
        and(
          eq(variantProductTables.isDeleted, false),
          eq(variantProductTables.productId, productId),
        ),
      );

    return res.status(200).json({
      success: true,
      data: variantProducts,
      message: "Variant products fetched successfully",
    });
  } catch (error) {
    handleError(
      error,
      res,
      VARIANT_PRODUCT_ENDPOINTS.GET_VARIANT_PRODUCTS_BY_PRODUCT,
    );
  }
};
