import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import blogCategoriesTable from "@/db/schema/blogs/blog_categories";
import { updateBlogCategoryValidationSchema } from "../blog-categories.validation";
import { eq } from "drizzle-orm";

/**
 * Updates an existing blog category record in the database
 * @param req Express request object containing blog category ID in params and update data in body
 * @param res Express response object
 * @returns JSON response with the updated blog category data or error message
 */
export const updateBlogCategoryV100 = async (req: Request, res: Response) => {
  try {
    // Combine params and body for validation
    const requestData = { ...req.body, id: req.params.id };

    // Validate input using Zod schema
    const validationResult =
      updateBlogCategoryValidationSchema.safeParse(requestData);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
      };
    }

    const { id, ...updateData } = validationResult.data;

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

    // Update the blog category record with updatedAt timestamp
    const updatedBlogCategory = await db
      .update(blogCategoriesTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(blogCategoriesTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Blog category updated successfully",
      data: updatedBlogCategory[0],
    });
  } catch (error) {
    handleError(error, res);
  }
};
