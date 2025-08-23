import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import blogsTable from "@/db/schema/blogs/blogs";
import { and, eq, not } from "drizzle-orm";
import { updateBlogValidationSchema } from "../validations/blogs.validation";
import { BLOG_ENDPOINTS } from "@/data/endpoints";

/**
 * Updates an existing blog record in the database
 * @param req Express request object
 * @param res Express response object
 */
export const updateBlogV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const { id } = req.params;
    if (!id) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Blog ID is required",
        endpoint: BLOG_ENDPOINTS.UPDATE_BLOG,
      };
    }
    const validationResult = updateBlogValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: BLOG_ENDPOINTS.UPDATE_BLOG,
      };
    }

    const { ...updateData } = validationResult.data;

    // Check if blog exists
    const existingBlog = await db
      .select()
      .from(blogsTable)
      .where(eq(blogsTable.id, id));

    if (existingBlog.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Blog not found",
        endpoint: BLOG_ENDPOINTS.UPDATE_BLOG,
      };
    }

    // Check for title conflicts if those are being updated
    if (updateData.title) {
      const titleToCheck = updateData.title || existingBlog[0].title;

      const conflictBlog = await db
        .select()
        .from(blogsTable)
        .where(
          and(
            eq(blogsTable.title, titleToCheck),
            not(eq(blogsTable.id, id)), // Exclude current blog
          ),
        );

      if (conflictBlog.length > 0) {
        throw {
          type: ERROR_TYPES.CONFLICT,
          message: "Blog with this title already exists",
          endpoint: BLOG_ENDPOINTS.UPDATE_BLOG,
        };
      }
    }

    // Update the blog record
    const updatedBlog = await db
      .update(blogsTable)
      .set({
        ...updateData,
      })
      .where(eq(blogsTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog[0],
    });
  } catch (error) {
    handleError(error, res, BLOG_ENDPOINTS.UPDATE_BLOG);
  }
};
