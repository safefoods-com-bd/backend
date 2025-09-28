import { db } from "@/db/db";
import slidersTable from "@/db/schema/others/sliders";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { handleError } from "@/utils/errorHandler";
import { generateHateoasLinksForCollection } from "@/utils/generateHateoasLinks";
import { SLIDER_ENDPOINTS } from "@/data/endpoints";
import { mediaTable, productsTable, variantProductsTable } from "@/db/schema";

/**
 * Controller function to retrieve sliders data with pagination and HATEOAS links.
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
 *   - data: Array of slider records
 *   - pagination: Object containing pagination details (offset, limit, total, currentCount)
 *   - _links: HATEOAS links for navigating the collection
 *   - message: Success message
 */
export const listAllSlidersV100 = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    // Fetch all non-deleted sliders
    const sliders = await db
      .select({
        id: slidersTable.id,
        title: slidersTable.title,
        url: mediaTable.url,
        productSlug: productsTable.slug,
        productTitle: productsTable.title,
        variantProductId: slidersTable.variantProductId,
        isDeleted: slidersTable.isDeleted,
        createdAt: slidersTable.createdAt,
        updatedAt: slidersTable.updatedAt,
      })
      .from(slidersTable)
      .leftJoin(mediaTable, eq(slidersTable.mediaId, mediaTable.id))
      .leftJoin(
        variantProductsTable,
        eq(slidersTable.variantProductId, variantProductsTable.id),
      )
      .leftJoin(
        productsTable,
        eq(variantProductsTable.productId, productsTable.id),
      )
      .where(eq(slidersTable.isDeleted, false))
      .orderBy(slidersTable.createdAt)
      .limit(limit)
      .offset(offset);

    // Count total number of sliders
    const countResult = await db
      .select()
      .from(slidersTable)
      .where(eq(slidersTable.isDeleted, false));

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
      data: sliders,
      pagination: {
        offset,
        limit,
        total,
        currentCount: sliders.length,
      },
      _links: links,
      message: "Sliders retrieved successfully",
    });
  } catch (error) {
    return handleError(error, res, SLIDER_ENDPOINTS.LIST_ALL_SLIDERS);
  }
};
