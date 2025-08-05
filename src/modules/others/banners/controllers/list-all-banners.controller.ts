import { db } from "@/db/db";
import bannersTable from "@/db/schema/others/banners";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { handleError } from "@/utils/errorHandler";
import { generateHateoasLinksForCollection } from "@/utils/generateHateoasLinks";
import { BANNER_ENDPOINTS } from "@/data/endpoints";
import { mediaTable, productsTable, variantProductsTable } from "@/db/schema";

/**
 * Controller function to retrieve banners data with pagination and HATEOAS links.
 *
 * @param req - Express Request object containing query parameters:
 *   - limit: (optional) Number of records to return per page, defaults to 10
 *   - offset: (optional) Number of records to skip, defaults to 0
 *   - sort: (optional) Sort order, defaults to "desc"
 *
 * @param res - Express Response object
 *
 * @returns JSON response with:
 *   - success: Boolean indicating if the operation was successful
 *   - data: Array of banner records
 *   - pagination: Object containing pagination details (offset, limit, total, currentCount)
 *   - _links: HATEOAS links for navigating the collection
 *   - message: Success message
 */
export const listAllBannersV100 = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    // Fetch all non-deleted banners
    const banners = await db
      .select({
        id: bannersTable.id,
        title: bannersTable.title,
        url: mediaTable.url,
        productSlug: productsTable.slug,
        variantProductId: bannersTable.variantProductId,
        isDeleted: bannersTable.isDeleted,
        createdAt: bannersTable.createdAt,
        updatedAt: bannersTable.updatedAt,
      })
      .from(bannersTable)
      .leftJoin(mediaTable, eq(bannersTable.mediaId, mediaTable.id))
      .leftJoin(
        variantProductsTable,
        eq(bannersTable.variantProductId, variantProductsTable.id),
      )
      .leftJoin(
        productsTable,
        eq(variantProductsTable.productId, productsTable.id),
      )
      .where(eq(bannersTable.isDeleted, false))
      .orderBy(bannersTable.createdAt)
      .limit(limit)
      .offset(offset);

    // Count total number of banners
    const countResult = await db
      .select()
      .from(bannersTable)
      .where(eq(bannersTable.isDeleted, false));

    const total = countResult.length;

    // Generate HATEOAS links
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const links = generateHateoasLinksForCollection({
      baseUrl,
      offset,
      limit,
      totalCount: total,
    });

    // Return response
    return res.status(200).json({
      success: true,
      data: banners,
      pagination: {
        offset,
        limit,
        total,
        currentCount: banners.length,
      },
      _links: links,
      message: "Banners retrieved successfully",
    });
  } catch (error) {
    return handleError(error, res, BANNER_ENDPOINTS.LIST_ALL_BANNERS);
  }
};
