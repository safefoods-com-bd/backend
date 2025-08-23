import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import blogCategoriesTable from "@/db/schema/blogs/blog_categories";
import {
  deleteBlogCategoryValidationSchema,
  deleteBlogCategoriesBatchValidationSchema,
} from "../blog-categories.validation";
import { eq, inArray } from "drizzle-orm";

/**
 * Deletes a single blog category record from the database
 * @param req Express request object containing blog category ID in body
 * @param res Express response object
 * @returns JSON response indicating deletion success or error message
 */
export const deleteBlogCategoryV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteBlogCategoryValidationSchema.safeParse(
      req.params,
    );

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
      };
    }

    const { id } = validationResult.data;

    // Check if blog category exists
    const existingBlogCategory = await db
      .select()
      .from(blogCategoriesTable)
      .where(eq(blogCategoriesTable.id, id));

    if (existingBlogCategory.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Blog category not found",
      };
    }

    // Delete the blog category record
    const deletedBlogCategory = await db
      .delete(blogCategoriesTable)
      .where(eq(blogCategoriesTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Blog category deleted successfully",
      data: deletedBlogCategory[0],
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Deletes multiple blog category records from the database in a batch operation
 * @param req Express request object containing array of blog category IDs in body
 * @param res Express response object
 * @returns JSON response indicating batch deletion success or error message
 */
export const deleteBlogCategoriesBatchV100 = async (
  req: Request,
  res: Response,
) => {
  try {
    // Validate input using Zod schema
    const validationResult =
      deleteBlogCategoriesBatchValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
      };
    }

    const { ids } = validationResult.data;

    // Delete the blog category records
    const deletedBlogCategories = await db
      .delete(blogCategoriesTable)
      .where(inArray(blogCategoriesTable.id, ids))
      .returning();

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedBlogCategories.length} blog categories`,
      data: deletedBlogCategories,
    });
  } catch (error) {
    handleError(error, res);
  }
};
