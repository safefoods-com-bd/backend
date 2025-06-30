import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import variantProductTables from "@/db/schema/product-management/products/variant_products";
import { variantProductValidationSchema } from "../variant-products.validation";
import { and, eq, isNull } from "drizzle-orm";
import { VARIANT_PRODUCT_ENDPOINTS } from "@/data/endpoints";
import productsTables from "@/db/schema/product-management/products/products";
import colorTables from "@/db/schema/utils/colors";
import unitsTable from "@/db/schema/utils/units";
import { stockTable } from "@/db/schema";

/**
 * Creates a new variant product record in the database
 *
 * @async
 * @function createVariantProductV100
 * @param {Request} req - Express request object containing variant product data in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response with the created variant product data
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 *
 * @description
 * This controller handles POST requests to create new variant product records.
 * It validates the incoming request body against variantProductValidationSchema.
 * If validation passes, it creates a new variant product record with the provided details.
 * Returns a 201 status with the created variant product record on success.
 */
export const createVariantProductV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = variantProductValidationSchema.safeParse(req.body);

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const {
      price,
      originalPrice,
      description,
      shortDescription,
      bestDeal,
      discountedSale,
      isActive,
      initialStock,
      productId,
      colorId,
      unitId,
    } = validation.data;

    // Check if the product exists
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

    // Check if the color exists
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

    // Check if the unit exists
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

    // Check if a variant product with the same combination already exists
    const existingVariant = await db
      .select()
      .from(variantProductTables)
      .where(
        and(
          eq(variantProductTables.productId, productId),
          colorId
            ? eq(variantProductTables.colorId, colorId)
            : isNull(variantProductTables.colorId),

          eq(variantProductTables.isDeleted, false),
          eq(variantProductTables.unitId, unitId),
        ),
      );

    if (existingVariant.length > 0) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message:
          "A variant with the same product, color, and size combination already exists",
      };
    }

    // Create variant product record
    const newVariantProduct = await db
      .insert(variantProductTables)
      .values({
        price,
        originalPrice,
        description,
        shortDescription,
        bestDeal: bestDeal !== undefined ? bestDeal : false,
        discountedSale: discountedSale !== undefined ? discountedSale : false,
        isActive: isActive !== undefined ? isActive : true,
        productId,
        colorId,
        unitId,
      })
      .returning();
    // Create initial stock record
    await db.insert(stockTable).values({
      warehouseId: "257b861a-50e6-4b79-a5fd-ae87ddefc88b", // Assuming a default warehouse ID
      variantProductId: newVariantProduct[0].id,
      quantity: initialStock,
    });

    return res.status(201).json({
      success: true,
      message: "Variant product created successfully",
      data: newVariantProduct[0],
    });
  } catch (error) {
    return handleError(
      error,
      res,
      VARIANT_PRODUCT_ENDPOINTS.CREATE_VARIANT_PRODUCT,
    );
  }
};
