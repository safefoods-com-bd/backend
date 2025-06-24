import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";

import stocksTable from "@/db/schema/stock-management/stocks";
import { updateStockValidationSchema } from "../stocks.validation";
import { STOCK_ENDPOINTS } from "@/data/endpoints";
import { eq } from "drizzle-orm";

/**
 * Updates an existing stock record in the database
 * @param req Express request object containing stock ID in params and update data in body
 * @param res Express response object
 * @returns JSON response with the updated stock data or error message
 */
export const updateStockV100 = async (req: Request, res: Response) => {
  try {
    // Combine params and body for validation
    const requestData = { ...req.body, id: req.params.id };

    // Validate input using Zod schema
    const validationResult = updateStockValidationSchema.safeParse(requestData);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: STOCK_ENDPOINTS.UPDATE_STOCK,
      };
    }

    const { id, ...updateData } = validationResult.data;

    // Check if stock exists
    const existingStock = await db
      .select()
      .from(stocksTable)
      .where(eq(stocksTable.id, id));

    if (existingStock.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Stock not found",
        endpoint: STOCK_ENDPOINTS.UPDATE_STOCK,
      };
    }

    // Remove undefined values from updateData to avoid updating fields with undefined
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined),
    );

    // Update the stock record with updatedAt timestamp
    const updatedStock = await db
      .update(stocksTable)
      .set({
        ...filteredUpdateData,
        updatedAt: new Date(),
      })
      .where(eq(stocksTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: updatedStock[0],
    });
  } catch (error) {
    handleError(error, res, STOCK_ENDPOINTS.UPDATE_STOCK);
  }
};
