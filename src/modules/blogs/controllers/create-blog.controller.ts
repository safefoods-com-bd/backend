import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import blogsTable from "@/db/schema/blogs/blogs";
import { blogValidationSchema } from "../validations/blogs.validation";
import { and, eq } from "drizzle-orm";
import { BLOG_ENDPOINTS } from "@/data/endpoints";

/**
 * Creates a new blog record in the database
 * @param req Express request object
 * @param res Express response object
 */
export const createBlogV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = blogValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: BLOG_ENDPOINTS.CREATE_BLOG,
      };
    }

    const { title, slug, content, authorName, blogCategoryId, mediaId } =
      validationResult.data;

    // Check if blog with the same title already exists
    const existingBlog = await db
      .select()
      .from(blogsTable)
      .where(and(eq(blogsTable.title, title)));

    if (existingBlog.length > 0) {
      throw {
        type: ERROR_TYPES.CONFLICT,
        message: "Blog with this title already exists",
        endpoint: BLOG_ENDPOINTS.CREATE_BLOG,
      };
    }

    // Create blog record
    const newBlog = await db
      .insert(blogsTable)
      .values({
        title,
        slug,
        content,
        authorName,
        blogCategoryId,
        mediaId,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: newBlog[0],
    });
  } catch (error) {
    handleError(error, res, BLOG_ENDPOINTS.CREATE_BLOG);
  }
};
