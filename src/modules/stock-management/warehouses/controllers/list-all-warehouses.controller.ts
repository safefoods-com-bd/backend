import { db } from "@/db/db";
import { warehouseTable } from "@/db/schema/stock-management/warehouses";
import { count, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { handleError } from "@/utils/errorHandler";
import { generateHateoasLinksForCollection } from "@/utils/generateHateoasLinks";
import { WAREHOUSE_ENDPOINTS } from "@/data/endpoints";

/**
 * Controller function to retrieve warehouse data with pagination and HATEOAS links.
 *
 * @param req - Express Request object containing query parameters:
 *   - limit: (optional) Number of records to return per page, defaults to 10
 *   - offset: (optional) Number of records to skip, defaults to 0
 *   - sort: (optional) Sort order, either "desc" or "asc", defaults to "desc"
 *   - isActive: (optional) Filter by active status
 *
 * @param res - Express Response object
 *
 * @returns JSON response with:
 *   - success: Boolean indicating if the operation was successful
 *   - data: Array of warehouse records
 *   - pagination: Object containing pagination details (offset, limit, total, currentCount)
 *   - _links: HATEOAS links for navigating the collection
 *   - message: Success message
 */
export const listAllWarehousesV100 = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const query = db
      .select()
      .from(warehouseTable)
      .where(eq(warehouseTable.isDeleted, false))
      .offset(offset)
      .limit(limit);

    // Apply ordering, offset and limit

    const data = await query;

    // Get the total count for pagination
    const totalCountQuery = db
      .select({ count: count() })
      .from(warehouseTable)
      .where(eq(warehouseTable.isDeleted, false));

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
      message: "Warehouses fetched successfully",
    });
  } catch (error) {
    handleError(error, res, WAREHOUSE_ENDPOINTS.LIST_ALL_WAREHOUSES);
  }
};
