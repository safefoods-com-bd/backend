import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import variantProductsMediaTables from "@/db/schema/product-management/products/variant_products_media";
import {
  deleteVariantProductMediaValidationSchema,
  deleteAllMediaFromVariantProductValidationSchema,
} from "../variant-product-media.validation";
import { and, eq } from "drizzle-orm";
import { VARIANT_PRODUCT_MEDIA_ENDPOINTS } from "@/data/endpoints";

/**
 * Deletes a media association from a variant product
 *
 * @async
 * @function deleteMediaFromVariantProductV100
 * @param {Request} req - Express request object containing media association ID
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response indicating success
 *
 * @description
 * This controller handles DELETE requests to remove a media association from a variant product.
 * It performs a soft delete by setting the isDeleted flag to true.
 * Returns a 200 status with a success message on successful deletion.
 */
export const deleteMediaFromVariantProductV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = deleteVariantProductMediaValidationSchema.safeParse(
      req.body,
    );

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { id } = validation.data;

    // Check if the media association exists
    const mediaAssociationExists = await db
      .select()
      .from(variantProductsMediaTables)
      .where(
        and(
          eq(variantProductsMediaTables.id, id),
          eq(variantProductsMediaTables.isDeleted, false),
        ),
      );

    if (mediaAssociationExists.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Media association not found",
      };
    }

    // Soft delete the media association
    await db
      .update(variantProductsMediaTables)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(variantProductsMediaTables.id, id));

    return res.status(200).json({
      success: true,
      message: "Media removed from variant product successfully",
    });
  } catch (error) {
    return handleError(
      error,
      res,
      VARIANT_PRODUCT_MEDIA_ENDPOINTS.DELETE_MEDIA_FROM_VARIANT_PRODUCT,
    );
  }
};

/**
 * Deletes all media associations for a specific variant product
 *
 * @async
 * @function deleteAllMediaFromVariantProductV100
 * @param {Request} req - Express request object containing variantProductId
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response indicating success
 *
 * @description
 * This controller handles DELETE requests to remove all media associations from a variant product.
 * It performs a soft delete by setting the isDeleted flag to true for all matching records.
 * Returns a 200 status with a success message on successful deletion.
 */
export const deleteAllMediaFromVariantProductV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { variantProductId } = req.params;

    // Validate input
    const validation =
      deleteAllMediaFromVariantProductValidationSchema.safeParse({
        variantProductId,
      });

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    // Check if any media associations exist for this variant product
    const mediaAssociationsExist = await db
      .select()
      .from(variantProductsMediaTables)
      .where(
        and(
          eq(variantProductsMediaTables.variantProductId, variantProductId),
          eq(variantProductsMediaTables.isDeleted, false),
        ),
      );

    if (mediaAssociationsExist.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No media associations found for this variant product",
      });
    }

    // Soft delete all media associations for this variant product
    await db
      .update(variantProductsMediaTables)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(
        and(
          eq(variantProductsMediaTables.variantProductId, variantProductId),
          eq(variantProductsMediaTables.isDeleted, false),
        ),
      );

    return res.status(200).json({
      success: true,
      message: `All media removed from variant product successfully (${mediaAssociationsExist.length} items)`,
    });
  } catch (error) {
    return handleError(
      error,
      res,
      VARIANT_PRODUCT_MEDIA_ENDPOINTS.DELETE_ALL_MEDIA_FROM_VARIANT_PRODUCT,
    );
  }
};
