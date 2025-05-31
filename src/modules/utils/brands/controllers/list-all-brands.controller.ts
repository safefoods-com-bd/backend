import { Request, Response } from "express";
import { db } from "@/db/db";
import { handleError } from "@/utils/errorHandler";
import { asc, desc, sql } from "drizzle-orm";
import brandTables from "@/db/schema/utils/brands";
import { BRAND_ENDPOINTS } from "@/data/endpoints";

/**
 * Lists all brand records from the database with optional filtering and pagination
 *
 * @async
 * @function listAllBrandsV100
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} A Promise resolving to a response with a list of brands
 *
 * @description
 * This controller handles GET requests to list all brand records.
 * It supports optional query parameters for sorting and pagination.
 * Returns a 200 status with the list of brands on success.
 */
// Helper function to apply sorting
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applySorting(query: any, sortBy: string, sortOrder: string) {
  const isAsc = sortOrder.toLowerCase() === "asc";

  switch (sortBy) {
    case "title":
      return query.orderBy(
        isAsc ? asc(brandTables.title) : desc(brandTables.title),
      );
    case "updatedAt":
      return query.orderBy(
        isAsc ? asc(brandTables.updatedAt) : desc(brandTables.updatedAt),
      );
    case "id":
      return query.orderBy(isAsc ? asc(brandTables.id) : desc(brandTables.id));
    case "createdAt":
    default:
      return query.orderBy(
        isAsc ? asc(brandTables.createdAt) : desc(brandTables.createdAt),
      );
  }
}

export const listAllBrandsV100 = async (
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
    const selectQueryBuilder = db.select().from(brandTables);

    // Apply search filter if provided
    if (search) {
      const searchQuery = sql`${brandTables.title} LIKE ${"%" + search + "%"}`;
      const filteredQuery = db.select().from(brandTables).where(searchQuery);

      // Count with search filter
      const countResult = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(brandTables)
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
        message: "Brands retrieved successfully",
        data: results,
        meta: pagination,
      });
    } else {
      // No search filter
      const countResult = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(brandTables);

      const countValue = countResult[0]?.count || 0;

      // Apply sorting
      const results = await applySorting(selectQueryBuilder, sortBy, sortOrder)
        .limit(limit)
        .offset(offset);

      return res.status(200).json({
        success: true,
        message: "Brands retrieved successfully",
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
    return handleError(error, res, BRAND_ENDPOINTS.LIST_ALL_BRANDS);
  }
};
