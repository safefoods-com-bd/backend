import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import categoriesTable from "@/db/schema/product-management/categories/categories";
import { eq } from "drizzle-orm";
import { CATEGORY_ENDPOINTS } from "@/data/endpoints";

/**
 * Gets a single category by ID
 * @param req Express request object
 * @param res Express response object
 */
export const getSingleCategoryV100 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Category ID is required",
      };
    }

    const category = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id));

    if (category.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Category not found",
      };
    }

    return res.status(200).json({
      success: true,
      data: category[0],
      message: "Category fetched successfully",
    });
  } catch (error) {
    handleError(error, res, CATEGORY_ENDPOINTS.GET_SINGLE_CATEGORY);
  }
};
