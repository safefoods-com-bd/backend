import { db } from "@/db/db";
import slidersTable from "@/db/schema/others/sliders";
import mediaTables from "@/db/schema/utils/media";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { handleError } from "@/utils/errorHandler";
import { generateHateoasLinksForCollection } from "@/utils/generateHateoasLinks";
import { SLIDER_ENDPOINTS } from "@/data/endpoints";

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
    const sort = (req.query.sort as string) || "desc";

    // Fetch all non-deleted sliders
    const sliders = await db
      .select({
        id: slidersTable.id,
        title: slidersTable.title,
        url: mediaTables.url,
        isDeleted: slidersTable.isDeleted,
        createdAt: slidersTable.createdAt,
        updatedAt: slidersTable.updatedAt,
      })
      .from(slidersTable)
      .where(eq(slidersTable.isDeleted, false))
      .leftJoin(mediaTables, eq(slidersTable.mediaId, mediaTables.id))
      .orderBy(sort === "asc" ? slidersTable.createdAt : slidersTable.createdAt)
      .limit(limit)
      .offset(offset);

    const totalCount = sliders.length;

    // Generate HATEOAS links
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const _links = generateHateoasLinksForCollection({
      baseUrl,
      offset,
      limit,
      totalCount: totalCount,
    });

    // Return response
    return res.status(200).json({
      success: true,
      data: sliders,
      pagination: {
        offset,
        limit,
        total: totalCount,
        currentCount: sliders.length,
      },
      _links: _links,
      message: "Sliders retrieved successfully",
    });
  } catch (error) {
    return handleError(error, res, SLIDER_ENDPOINTS.LIST_ALL_SLIDERS);
  }
};
