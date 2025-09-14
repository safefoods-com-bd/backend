import { Request, Response } from "express";
import { eq, inArray } from "drizzle-orm";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { db } from "@/db/db";
import categoriesTable from "@/db/schema/product-management/categories/categories";
import {
  deleteCategoryValidationSchema,
  deleteCategoriesBatchValidationSchema,
} from "../category.validation";
import { CATEGORY_ENDPOINTS } from "@/data/endpoints";

/**
 * Deletes a category record
 * @param req Express request object
 * @param res Express response object
 */
export const deleteCategoryV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteCategoryValidationSchema.safeParse(
      req.params,
    );

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: CATEGORY_ENDPOINTS.DELETE_CATEGORY,
      };
    }

    const { id } = validationResult.data;

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id));

    if (existingCategory.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Category not found",
        endpoint: CATEGORY_ENDPOINTS.DELETE_CATEGORY,
      };
    }

    // Check if this category has child categories (where this category is the parent)
    const childCategories = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.parentId, id));

    if (childCategories.length > 0) {
      throw {
        type: ERROR_TYPES.CONFLICT,
        message:
          "Cannot delete category with child categories. Please delete or reassign child categories first.",
        endpoint: CATEGORY_ENDPOINTS.DELETE_CATEGORY,
      };
    }

    // Delete the category
    const deletedCategory = await db
      .delete(categoriesTable)
      .where(eq(categoriesTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deletedCategory[0],
    });
  } catch (error) {
    handleError(error, res, CATEGORY_ENDPOINTS.DELETE_CATEGORY);
  }
};

/**
 * Deletes multiple category records
 * @param req Express request object
 * @param res Express response object
 */
export const deleteCategoriesBatchV100 = async (
  req: Request,
  res: Response,
) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteCategoriesBatchValidationSchema.safeParse(
      req.body,
    );

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: CATEGORY_ENDPOINTS.DELETE_CATEGORIES_BATCH,
      };
    }

    const { ids } = validationResult.data;

    // Check if any of these categories have child categories
    const childCategories = await db
      .select()
      .from(categoriesTable)
      .where(inArray(categoriesTable.parentId, ids));

    if (childCategories.length > 0) {
      throw {
        type: ERROR_TYPES.CONFLICT,
        message:
          "Cannot delete categories with child categories. Please delete or reassign child categories first.",
        endpoint: CATEGORY_ENDPOINTS.DELETE_CATEGORIES_BATCH,
      };
    }

    // Delete the categories
    const deletedCategories = await db
      .delete(categoriesTable)
      .where(inArray(categoriesTable.id, ids))
      .returning();

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedCategories.length} categories`,
      data: deletedCategories,
    });
  } catch (error) {
    handleError(error, res, CATEGORY_ENDPOINTS.DELETE_CATEGORIES_BATCH);
  }
};
