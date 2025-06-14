import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";

import stocksTable from "@/db/schema/stock-management/stocks";
import {
  deleteStocksBatchValidationSchema,
  deleteStockValidationSchema,
} from "../stocks.validation";
import { STOCK_ENDPOINTS } from "@/data/endpoints";
import { eq, inArray } from "drizzle-orm";

/**
 * Deletes a single stock record from the database
 * @param req Express request object containing stock ID in body
 * @param res Express response object
 * @returns JSON response indicating deletion success or error message
 */
export const deleteStockV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteStockValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: STOCK_ENDPOINTS.DELETE_STOCK,
      };
    }

    const { id } = validationResult.data;

    // Check if stock exists
    const existingStock = await db
      .select()
      .from(stocksTable)
      .where(eq(stocksTable.id, id));

    if (existingStock.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Stock not found",
        endpoint: STOCK_ENDPOINTS.DELETE_STOCK,
      };
    }

    // Delete the stock record
    const deletedStock = await db
      .delete(stocksTable)
      .where(eq(stocksTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Stock deleted successfully",
      data: deletedStock[0],
    });
  } catch (error) {
    handleError(error, res, STOCK_ENDPOINTS.DELETE_STOCK);
  }
};

/**
 * Deletes multiple stock records from the database in a batch operation
 * @param req Express request object containing array of stock IDs in body
 * @param res Express response object
 * @returns JSON response indicating batch deletion success or error message
 */
export const deleteStocksBatchV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteStocksBatchValidationSchema.safeParse(
      req.body,
    );

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: STOCK_ENDPOINTS.DELETE_STOCKS_BATCH,
      };
    }

    const { ids } = validationResult.data;

    // Delete the stock records
    const deletedStocks = await db
      .delete(stocksTable)
      .where(inArray(stocksTable.id, ids))
      .returning();

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedStocks.length} stocks`,
      data: deletedStocks,
    });
  } catch (error) {
    handleError(error, res, STOCK_ENDPOINTS.DELETE_STOCKS_BATCH);
  }
};
