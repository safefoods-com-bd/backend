import { Request, Response } from "express";
import { db } from "@/db/db";
import { handleError } from "@/utils/errorHandler";
import variantProductsMediaTables from "@/db/schema/product-management/products/variant_products_media";
import { and, eq } from "drizzle-orm";
import { VARIANT_PRODUCT_MEDIA_ENDPOINTS } from "@/data/endpoints";
import mediaTables from "@/db/schema/utils/media";

/**
 * Lists all media associated with a specific variant product
 *
 * @async
 * @function listMediaByVariantProductV100
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} A Promise resolving to a response with a list of media for a variant product
 *
 * @description
 * This controller handles GET requests to list all media for a specific variant product.
 * It retrieves the variantProductId from the request params and returns all associated media.
 * Returns a 200 status with the list of media on success.
 */
export const listMediaByVariantProductV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { variantProductId } = req.params;

    if (!variantProductId) {
      return res.status(400).json({
        success: false,
        message: "Variant product ID is required",
      });
    }

    // Build the select query to get media associated with the variant product
    const mediaList = await db
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
      .where(
        and(
          eq(variantProductsMediaTables.variantProductId, variantProductId),
          eq(variantProductsMediaTables.isDeleted, false),
        ),
      );

    return res.status(200).json({
      success: true,
      message: "Media retrieved successfully",
      data: mediaList,
    });
  } catch (error) {
    return handleError(
      error,
      res,
      VARIANT_PRODUCT_MEDIA_ENDPOINTS.LIST_MEDIA_BY_VARIANT_PRODUCT,
    );
  }
};
