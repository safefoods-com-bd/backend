import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import variantProductTables from "@/db/schema/product-management/products/variant_products";
import { updateVariantProductValidationSchema } from "../variant-products.validation";
import { and, eq, ne, sql } from "drizzle-orm";
import { VARIANT_PRODUCT_ENDPOINTS } from "@/data/endpoints";
import productsTables from "@/db/schema/product-management/products/products";
import colorTables from "@/db/schema/utils/colors";
import unitsTable from "@/db/schema/utils/units";

/**
 * Updates an existing variant product record in the database
 *
 * @async
 * @function updateVariantProductV100
 * @param {Request} req - Express request object containing variant product data in the body with id
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response with the updated variant product data
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 * @throws {Object} Throws an error object with type NOT_FOUND if variant product with provided id does not exist
 *
 * @description
 * This controller handles PATCH requests to update variant product records.
 * It validates the incoming request body against updateVariantProductValidationSchema.
 * If validation passes, it updates the variant product record with the provided data.
 * Returns a 200 status with the updated variant product record on success.
 */
export const updateVariantProductV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = updateVariantProductValidationSchema.safeParse(req.body);

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const {
      id,
      price,
      originalPrice,
      description,
      shortDescription,
      bestDeal,
      discountedSale,
      isActive,
      productId,
      colorId,
      unitId,
    } = validation.data;

    // Check if variant product exists
    const existingVariantProduct = await db
      .select()
      .from(variantProductTables)
      .where(eq(variantProductTables.id, id));

    if (existingVariantProduct.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Variant product not found",
      };
    }

    // Check if the product exists (if productId is provided)
    if (productId) {
      const productExists = await db
        .select()
        .from(productsTables)
        .where(eq(productsTables.id, productId));

      if (productExists.length === 0) {
        throw {
          type: ERROR_TYPES.VALIDATION,
          message: "Product not found",
        };
      }
    }

    // Check if the color exists (if colorId is provided)
    if (colorId) {
      const colorExists = await db
        .select()
        .from(colorTables)
        .where(eq(colorTables.id, colorId));

      if (colorExists.length === 0) {
        throw {
          type: ERROR_TYPES.VALIDATION,
          message: "Color not found",
        };
      }
    }

    // Check if the unit exists (if unitId is provided)
    if (unitId) {
      const unitExists = await db
        .select()
        .from(unitsTable)
        .where(eq(unitsTable.id, unitId));

      if (unitExists.length === 0) {
        throw {
          type: ERROR_TYPES.VALIDATION,
          message: "Unit not found",
        };
      }
    }

    // Check for duplicate combinations if any of productId, colorId, or sizeId are updated
    if (productId || colorId) {
      const checkProductId = productId || existingVariantProduct[0].productId;
      const checkColorId = colorId || existingVariantProduct[0].colorId;

      const existingVariant = await db
        .select()
        .from(variantProductTables)
        .where(
          and(
            eq(variantProductTables.productId, checkProductId),
            checkColorId !== null
              ? eq(variantProductTables.colorId, checkColorId)
              : sql`(${variantProductTables.colorId} IS NULL)`,
            ne(variantProductTables.id, id),
            eq(variantProductTables.isDeleted, false),
          ),
        );

      if (existingVariant.length > 0) {
        throw {
          type: ERROR_TYPES.VALIDATION,
          message:
            "A variant with the same product, color, and size combination already exists",
        };
      }
    }

    // Update variant product
    const updatedVariantProduct = await db
      .update(variantProductTables)
      .set({
        price: price !== undefined ? price : existingVariantProduct[0].price,
        originalPrice:
          originalPrice !== undefined
            ? originalPrice
            : existingVariantProduct[0].originalPrice,
        description:
          description !== undefined
            ? description
            : existingVariantProduct[0].description,
        shortDescription:
          shortDescription !== undefined
            ? shortDescription
            : existingVariantProduct[0].shortDescription,
        bestDeal:
          bestDeal !== undefined
            ? bestDeal
            : existingVariantProduct[0].bestDeal,
        discountedSale:
          discountedSale !== undefined
            ? discountedSale
            : existingVariantProduct[0].discountedSale,
        isActive:
          isActive !== undefined
            ? isActive
            : existingVariantProduct[0].isActive,
        productId: productId || existingVariantProduct[0].productId,
        colorId: colorId || existingVariantProduct[0].colorId,
        unitId: unitId || existingVariantProduct[0].unitId,
        updatedAt: new Date(),
      })
      .where(eq(variantProductTables.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Variant product updated successfully",
      data: updatedVariantProduct[0],
    });
  } catch (error) {
    return handleError(
      error,
      res,
      VARIANT_PRODUCT_ENDPOINTS.UPDATE_VARIANT_PRODUCT,
    );
  }
};

/**
 * Express request handler (exports as PATCH for semantic name resolution)
 */
export const PATCH = updateVariantProductV100;
