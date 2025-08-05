import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import bannersTable from "@/db/schema/others/banners";
import { eq, and } from "drizzle-orm";
import { BANNER_ENDPOINTS } from "@/data/endpoints";
import { mediaTable, productsTable } from "@/db/schema";
import variantProductTables from "@/db/schema/product-management/products/variant_products";

/**
 * Gets a single banner by ID
 * @param req Express request object
 * @param res Express response object
 */
export const getSingleBannerV100 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Banner ID is required",
        endpoint: BANNER_ENDPOINTS.GET_SINGLE_BANNER,
      };
    }

    const banner = await db
      .select({
        id: bannersTable.id,
        title: bannersTable.title,
        url: mediaTable.url,
        variantProductId: bannersTable.variantProductId,
        productSlug: productsTable.slug,
        isDeleted: bannersTable.isDeleted,
        createdAt: bannersTable.createdAt,
        updatedAt: bannersTable.updatedAt,
      })
      .from(bannersTable)
      .leftJoin(mediaTable, eq(bannersTable.mediaId, mediaTable.id))
      .leftJoin(
        productsTable,
        eq(variantProductTables.productId, productsTable.id),
      )
      .where(and(eq(bannersTable.id, id), eq(bannersTable.isDeleted, false)));

    if (banner.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Banner not found",
        endpoint: BANNER_ENDPOINTS.GET_SINGLE_BANNER,
      };
    }

    return res.status(200).json({
      success: true,
      data: banner[0],
      message: "Banner fetched successfully",
    });
  } catch (error) {
    return handleError(error, res, BANNER_ENDPOINTS.GET_SINGLE_BANNER);
  }
};
