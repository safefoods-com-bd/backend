import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import variantProductTables from "@/db/schema/product-management/products/variant_products";
import { eq } from "drizzle-orm";
import { VARIANT_PRODUCT_ENDPOINTS } from "@/data/endpoints";
import productsTables from "@/db/schema/product-management/products/products";
import colorTables from "@/db/schema/utils/colors";
import unitsTable from "@/db/schema/utils/units";
import { stockTable } from "@/db/schema";

/**
 * Gets a single variant product by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
export const getSingleVariantProductV100 = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Variant Product ID is required",
      };
    }

    const variantProduct = await db
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
        isDeleted: variantProductTables.isDeleted,
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
      .where(eq(variantProductTables.id, id));

    if (variantProduct.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Variant product not found",
      };
    }

    return res.status(200).json({
      success: true,
      data: variantProduct[0],
      message: "Variant product fetched successfully",
    });
  } catch (error) {
    handleError(
      error,
      res,
      VARIANT_PRODUCT_ENDPOINTS.GET_SINGLE_VARIANT_PRODUCT,
    );
  }
};
