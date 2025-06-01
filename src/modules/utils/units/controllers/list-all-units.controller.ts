import { db } from "@/db/db";
import { unitsTable } from "@/db/schema/utils/units";
import { count } from "drizzle-orm";
import { Request, Response } from "express";
import { handleError } from "@/utils/errorHandler";
import { generateHateoasLinksForCollection } from "@/utils/generateHateoasLinks";
import { UNIT_ENDPOINTS } from "@/data/endpoints";

/**
 * Controller function to retrieve units data with pagination and HATEOAS links.
 *
 * @param req - Express Request object containing query parameters:
 *   - limit: (optional) Number of records to return per page, defaults to 10
 *   - offset: (optional) Number of records to skip, defaults to 0
 *
 * @param res - Express Response object
 *
 * @returns JSON response with:
 *   - success: Boolean indicating if the operation was successful
 *   - data: Array of unit records
 *   - pagination: Object containing pagination details (offset, limit, total, currentCount)
 *   - _links: HATEOAS links for navigating the collection
 *   - message: Success message
 */
export const listAllUnitsV100 = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const query = db.select().from(unitsTable).offset(offset).limit(limit);

    // Apply ordering, offset and limit
    const data = await query;

    // Get the total count for pagination
    const totalCountQuery = db.select({ count: count() }).from(unitsTable);

    const totalCount = await totalCountQuery;

    // Generate HATEOAS links
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const _links = generateHateoasLinksForCollection({
      baseUrl,
      offset,
      limit,
      totalCount: totalCount[0]?.count || 0,
    });

    return res.status(200).json({
      success: true,
      data: data,
      pagination: {
        offset,
        limit,
        total: totalCount[0]?.count,
        currentCount: data.length,
      },
      _links,
      message: "Units fetched successfully",
    });
  } catch (error) {
    handleError(error, res, UNIT_ENDPOINTS.LIST_ALL_UNITS);
  }
};
