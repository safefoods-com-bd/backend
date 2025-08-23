import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import blogsTable from "@/db/schema/blogs/blogs";
import { eq } from "drizzle-orm";
import { BLOG_ENDPOINTS } from "@/data/endpoints";
import { blogCategoriesTable, mediaTable } from "@/db/schema";

/**
 * Gets a single blog by slug
 * @param req Express request object
 * @param res Express response object
 */
export const getSingleBlogV100 = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Blog slug is required",
      };
    }

    const blog = await db
      .select({
        id: blogsTable.id,
        title: blogsTable.title,
        slug: blogsTable.slug,
        content: blogsTable.content,
        authorName: blogsTable.authorName,
        mediaId: blogsTable.mediaId,
        mediaUrl: mediaTable.url,
        createdAt: blogsTable.createdAt,
        updatedAt: blogsTable.updatedAt,
        blogCategoryId: blogsTable.blogCategoryId,
        blogCategoryName: blogCategoriesTable.title,
      })
      .from(blogsTable)
      .leftJoin(
        blogCategoriesTable,
        eq(blogsTable.blogCategoryId, blogCategoriesTable.id),
      )
      .leftJoin(mediaTable, eq(mediaTable.id, blogsTable.mediaId))
      .where(eq(blogsTable.slug, slug));

    if (blog.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Blog not found",
      };
    }

    return res.status(200).json({
      success: true,
      data: blog[0],
      message: "Blog fetched successfully",
    });
  } catch (error) {
    handleError(error, res, BLOG_ENDPOINTS.GET_SINGLE_BLOG);
  }
};
