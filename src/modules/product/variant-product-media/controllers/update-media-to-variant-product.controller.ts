import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import variantProductsMediaTables from "@/db/schema/product-management/products/variant_products_media";
import { updateVariantProductMediaValidationSchema } from "../variant-product-media.validation";
import { and, eq } from "drizzle-orm";
import { VARIANT_PRODUCT_MEDIA_ENDPOINTS } from "@/data/endpoints";
import variantProductTables from "@/db/schema/product-management/products/variant_products";
import mediaTables from "@/db/schema/utils/media";

/**
 * Updates a media association for a variant product
 *
 * @async
 * @function updateMediaForVariantProductV100
 * @param {Request} req - Express request object containing the update details
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response with the updated media association
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 *
 * @description
 * This controller handles PATCH requests to update a media association for a variant product.
 * It allows replacing an existing media with a new one while maintaining the same association record.
 * Returns a 200 status with the updated association on success.
 */
export const updateMediaForVariantProductV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = updateVariantProductMediaValidationSchema.safeParse(
      req.body,
    );

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { id, mediaId } = validation.data;

    // Check if the association exists
    const existingAssociation = await db
      .select()
      .from(variantProductsMediaTables)
      .where(
        and(
          eq(variantProductsMediaTables.id, id),
          eq(variantProductsMediaTables.isDeleted, false),
        ),
      );

    if (existingAssociation.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Media association not found",
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

    // Check if the variant product exists
    const variantProductId = existingAssociation[0].variantProductId;
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

    // Check if the new media is already associated with this variant product
    const duplicateAssociation = await db
      .select()
      .from(variantProductsMediaTables)
      .where(
        and(
          eq(variantProductsMediaTables.variantProductId, variantProductId),
          eq(variantProductsMediaTables.mediaId, mediaId),
          eq(variantProductsMediaTables.isDeleted, false),
        ),
      );

    if (duplicateAssociation.length > 0 && duplicateAssociation[0].id !== id) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "This media is already associated with this variant product",
      };
    }

    // Update the association
    await db
      .update(variantProductsMediaTables)
      .set({
        mediaId,
        updatedAt: new Date(),
      })
      .where(eq(variantProductsMediaTables.id, id));

    // Get the updated association with media details
    const result = await db
      .select({
        id: variantProductsMediaTables.id,
        variantProductId: variantProductsMediaTables.variantProductId,
        mediaId: variantProductsMediaTables.mediaId,
        createdAt: variantProductsMediaTables.createdAt,
        updatedAt: variantProductsMediaTables.updatedAt,
        mediaUrl: mediaTables.url,
        mediaTitle: mediaTables.title,
      })
      .from(variantProductsMediaTables)
      .leftJoin(
        mediaTables,
        eq(variantProductsMediaTables.mediaId, mediaTables.id),
      )
      .where(eq(variantProductsMediaTables.id, id));

    return res.status(200).json({
      success: true,
      message: "Media for variant product updated successfully",
      data: result[0],
    });
  } catch (error) {
    return handleError(
      error,
      res,
      VARIANT_PRODUCT_MEDIA_ENDPOINTS.UPDATE_MEDIA_FOR_VARIANT_PRODUCT,
    );
  }
};
