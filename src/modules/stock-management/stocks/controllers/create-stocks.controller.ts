import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";

import stocksTable from "@/db/schema/stock-management/stocks";
import { stockValidationSchema } from "../stocks.validation";
import { STOCK_ENDPOINTS } from "@/data/endpoints";

/**
 * Creates a new stock record in the database
 * @param req Express request object containing stock data
 * @param res Express response object
 * @returns JSON response with the created stock data or error message
 */
export const createStockV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = stockValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: STOCK_ENDPOINTS.CREATE_STOCK,
      };
    }

    const { quantity, warehouseId, variantProductId } = validationResult.data;

    // Create stock record
    const newStock = await db
      .insert(stocksTable)
      .values({
        quantity,
        warehouseId,
        variantProductId,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Stock created successfully",
      data: newStock[0],
    });
  } catch (error) {
    handleError(error, res, STOCK_ENDPOINTS.CREATE_STOCK);
  }
};
