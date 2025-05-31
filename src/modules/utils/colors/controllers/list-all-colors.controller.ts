import { Request, Response } from "express";
import { db } from "@/db/db";
import { handleError } from "@/utils/errorHandler";
import { asc, desc, sql } from "drizzle-orm";
import colorTables from "@/db/schema/utils/colors";
import { COLOR_ENDPOINTS } from "@/data/endpoints";

/**
 * Lists all color records from the database with optional filtering and pagination
 *
 * @async
 * @function listAllColorsV100
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} A Promise resolving to a response with a list of colors
 *
 * @description
 * This controller handles GET requests to list all color records.
 * It supports optional query parameters for sorting and pagination.
 * Returns a 200 status with the list of colors on success.
 */
export const listAllColorsV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const offset = (page - 1) * limit;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as string) || "desc";
    const search = req.query.search as string;

    // Build the select query
    const selectQueryBuilder = db.select().from(colorTables);

    // Apply search filter if provided
    if (search) {
      const searchQuery = sql`${colorTables.title} LIKE ${"%" + search + "%"} OR ${colorTables.colorCode} LIKE ${"%" + search + "%"}`;
      const filteredQuery = db.select().from(colorTables).where(searchQuery);
      // const colors = await filteredQuery.limit(limit).offset(offset);

      // Count with search filter
      const countResult = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(colorTables)
        .where(searchQuery);

      const countValue = countResult[0]?.count || 0;

      // Apply sorting
      const results = await applySorting(filteredQuery, sortBy, sortOrder)
        .limit(limit)
        .offset(offset);

      const pagination = {
        page,
        limit,
        totalRecords: countValue,
        totalPages: Math.ceil(countValue / limit),
      };

      return res.status(200).json({
        success: true,
        message: "Colors retrieved successfully",
        data: results,
        meta: pagination,
      });
    } else {
      // No search filter
      const countResult = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(colorTables);

      const countValue = countResult[0]?.count || 0;

      // Apply sorting
      const results = await applySorting(selectQueryBuilder, sortBy, sortOrder)
        .limit(limit)
        .offset(offset);

      return res.status(200).json({
        success: true,
        message: "Colors retrieved successfully",
        data: results,
        pagination: {
          page,
          limit,
          totalRecords: Number(countValue),
          totalPages: Math.ceil(countValue / limit),
        },
      });
    }
  } catch (error) {
    return handleError(error, res, COLOR_ENDPOINTS.LIST_ALL_COLORS);
  }
};

// Helper function to apply sorting
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applySorting(query: any, sortBy: string, sortOrder: string) {
  const isAsc = sortOrder.toLowerCase() === "asc";

  switch (sortBy) {
    case "title":
      return query.orderBy(
        isAsc ? asc(colorTables.title) : desc(colorTables.title),
      );
    case "colorCode":
      return query.orderBy(
        isAsc ? asc(colorTables.colorCode) : desc(colorTables.colorCode),
      );
    case "updatedAt":
      return query.orderBy(
        isAsc ? asc(colorTables.updatedAt) : desc(colorTables.updatedAt),
      );
    case "id":
      return query.orderBy(isAsc ? asc(colorTables.id) : desc(colorTables.id));
    case "createdAt":
    default:
      return query.orderBy(
        isAsc ? asc(colorTables.createdAt) : desc(colorTables.createdAt),
      );
  }
}
