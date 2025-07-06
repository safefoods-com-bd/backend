import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import variantProductsMediaTables from "@/db/schema/product-management/products/variant_products_media";
import { variantProductMediaValidationSchema } from "../variant-product-media.validation";
import { and, eq } from "drizzle-orm";
import { VARIANT_PRODUCT_MEDIA_ENDPOINTS } from "@/data/endpoints";
import variantProductTables from "@/db/schema/product-management/products/variant_products";
import mediaTables from "@/db/schema/utils/media";

/**
 * Adds media to a variant product
 *
 * @async
 * @function addMediaToVariantProductV100
 * @param {Request} req - Express request object containing variant product media data in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response with the created media association
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 *
 * @description
 * This controller handles POST requests to add media to variant products.
 * It validates the incoming request body against variantProductMediaValidationSchema.
 * If validation passes, it creates a new association between a variant product and media.
 * Returns a 201 status with the created association on success.
 */
export const addMediaToVariantProductV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = variantProductMediaValidationSchema.safeParse(req.body);

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { variantProductId, mediaId } = validation.data;

    // Check if the variant product exists
    const variantProductExists = await db
      .select()
      .from(variantProductTables)
      .where(
        and(
          eq(variantProductTables.id, variantProductId),
          eq(variantProductTables.isDeleted, false),
        ),
      );

    if (variantProductExists.length === 0) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Variant product not found",
      };
    }

    // Check if the media exists
    const mediaExists = await db
      .select()
      .from(mediaTables)
      .where(eq(mediaTables.id, mediaId));

    if (mediaExists.length === 0) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Media not found",
      };
    }

    // Check if the association already exists
    const existingAssociation = await db
      .select()
      .from(variantProductsMediaTables)
      .where(
        and(
          eq(variantProductsMediaTables.variantProductId, variantProductId),
          eq(variantProductsMediaTables.mediaId, mediaId),
          eq(variantProductsMediaTables.isDeleted, false),
        ),
      );

    if (existingAssociation.length > 0) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "This media is already associated with this variant product",
      };
    }

    // Create variant product media association
    const newAssociation = await db
      .insert(variantProductsMediaTables)
      .values({
        variantProductId,
        mediaId,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Media added to variant product successfully",
      data: newAssociation[0],
    });
  } catch (error) {
    return handleError(
      error,
      res,
      VARIANT_PRODUCT_MEDIA_ENDPOINTS.ADD_MEDIA_TO_VARIANT_PRODUCT,
    );
  }
};
