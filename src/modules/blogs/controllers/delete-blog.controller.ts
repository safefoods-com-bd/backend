import { Request, Response } from "express";
import { eq, inArray } from "drizzle-orm";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { db } from "@/db/db";
import blogsTable from "@/db/schema/blogs/blogs";
import {
  deleteBlogValidationSchema,
  deleteBlogsBatchValidationSchema,
} from "../validations/blogs.validation";
import { BLOG_ENDPOINTS } from "@/data/endpoints";

/**
 * Deletes a blog record
 * @param req Express request object
 * @param res Express response object
 */
export const deleteBlogV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteBlogValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: BLOG_ENDPOINTS.DELETE_BLOG,
      };
    }

    const { id } = validationResult.data;

    // Check if blog exists
    const existingBlog = await db
      .select()
      .from(blogsTable)
      .where(eq(blogsTable.id, id));

    if (existingBlog.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Blog not found",
        endpoint: BLOG_ENDPOINTS.DELETE_BLOG,
      };
    }

    // Delete the blog
    const deletedBlog = await db
      .delete(blogsTable)
      .where(eq(blogsTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      data: deletedBlog[0],
    });
  } catch (error) {
    handleError(error, res, BLOG_ENDPOINTS.DELETE_BLOG);
  }
};

/**
 * Deletes multiple blog records
 * @param req Express request object
 * @param res Express response object
 */
export const deleteBlogsBatchV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteBlogsBatchValidationSchema.safeParse(
      req.body,
    );

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: BLOG_ENDPOINTS.DELETE_BLOGS_BATCH,
      };
    }

    const { ids } = validationResult.data;

    // Delete the blogs
    const deletedBlogs = await db
      .delete(blogsTable)
      .where(inArray(blogsTable.id, ids))
      .returning();

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedBlogs.length} blogs`,
      data: deletedBlogs,
    });
  } catch (error) {
    handleError(error, res, BLOG_ENDPOINTS.DELETE_BLOGS_BATCH);
  }
};
