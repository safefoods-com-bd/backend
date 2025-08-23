import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import blogCategoriesTable from "@/db/schema/blogs/blog_categories";
import { blogCategoryValidationSchema } from "../blog-categories.validation";

/**
 * Creates a new blog category record in the database
 * @param req Express request object containing blog category data
 * @param res Express response object
 * @returns JSON response with the created blog category data or error message
 */
export const createBlogCategoryV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = blogCategoryValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
      };
    }

    const { title, slug } = validationResult.data;

    // Create blog category record
    const newBlogCategory = await db
      .insert(blogCategoriesTable)
      .values({
        title,
        slug,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Blog category created successfully",
      data: newBlogCategory[0],
    });
  } catch (error) {
    handleError(error, res);
  }
};
