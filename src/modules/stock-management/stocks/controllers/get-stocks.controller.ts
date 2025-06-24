import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";

import stocksTable from "@/db/schema/stock-management/stocks";
import { getWarehouseStocksValidationSchema } from "../stocks.validation";
import { STOCK_ENDPOINTS } from "@/data/endpoints";
import { desc, eq, count } from "drizzle-orm";

import { generateHateoasLinksForCollection } from "@/utils/generateHateoasLinks";
/**
 * Retrieves all stocks for a specific warehouse with pagination
 * @param req Express request object containing the warehouse ID in params
 * @param res Express response object
 *
 * @returns JSON response with the warehouse's stocks or error message
 */
export const getAllStocksV100 = async (req: Request, res: Response) => {
  try {
    // Validate and parse warehouse ID from params
    const validation = getWarehouseStocksValidationSchema.safeParse(req.params);
    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
        endpoint: STOCK_ENDPOINTS.GET_ALL_STOCKS,
      };
    }

    const { warehouseId } = validation.data;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const sort = (req.query.sort as string) || "desc";

    const query = db
      .select()
      .from(stocksTable)
      .where(eq(stocksTable.warehouseId, warehouseId))
      .orderBy(
        sort === "desc" ? desc(stocksTable.createdAt) : stocksTable.createdAt,
      )
      .offset(offset)
      .limit(limit);

    const data = await query;

    const totalCountQuery = db
      .select({ count: count() })
      .from(stocksTable)
      .where(eq(stocksTable.warehouseId, warehouseId));
    const totalCount = await totalCountQuery;

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const _links = generateHateoasLinksForCollection({
      baseUrl,
      offset,
      limit,
      totalCount: totalCount[0]?.count || 0,
    });

    return res.status(200).json({
      success: true,
      message: "Warehouse stocks fetched successfully",
      data: data,
      pagination: {
        offset,
        limit,
        total: totalCount[0]?.count,
        currentCount: data.length,
      },
      _links,
    });
  } catch (error) {
    handleError(error, res, STOCK_ENDPOINTS.GET_ALL_STOCKS);
  }
};
