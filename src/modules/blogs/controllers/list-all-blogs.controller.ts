import { db } from "@/db/db";
import blogsTable from "@/db/schema/blogs/blogs";
import { eq, sql } from "drizzle-orm";
import { Request, Response } from "express";
import { handleError } from "@/utils/errorHandler";
import { generateHateoasLinksForCollection } from "@/utils/generateHateoasLinks";
import { BLOG_ENDPOINTS } from "@/data/endpoints";
import { mediaTable } from "@/db/schema";
import blogCategoriesTable from "@/db/schema/blogs/blog_categories";

/**
 * Controller function to retrieve blogs data with pagination and HATEOAS links.
 *
 * @param req - Express Request object containing query parameters:
 *   - limit: (optional) Number of records to return per page, defaults to 10
 *   - offset: (optional) Number of records to skip, defaults to 0
 *   - sort: (optional) Sort order, defaults to "desc"
 *   - search: (optional) search by title
 *
 * @param res - Express Response object
 *
 * @returns JSON response with:
 *   - success: Boolean indicating if the operation was successful
 *   - data: Array of blog records
 *   - pagination: Object containing pagination details (offset, limit, total, currentCount)
 *   - _links: HATEOAS links for navigating the collection
 *   - message: Success message
 */
export const listAllBlogsV100 = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const search = (req.query.search as string) || "";

    // Build where conditions
    const whereConditions = [];
    if (search) {
      whereConditions.push(
        sql`LOWER(${blogsTable.title}) LIKE LOWER(${"%" + search + "%"})`,
      );
    }

    // First, fetch all blogs along with their blog categories
    const allBlogs = await db
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
      .where(
        whereConditions.length > 0
          ? sql`${sql.join(whereConditions, sql` AND `)}`
          : undefined,
      );

    // Get the total count for pagination
    const totalCount = allBlogs.length;

    // Generate HATEOAS links
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const _links = generateHateoasLinksForCollection({
      baseUrl,
      offset,
      limit,
      totalCount: totalCount,
    });

    return res.status(200).json({
      success: true,
      data: allBlogs,
      pagination: {
        offset,
        limit,
        total: totalCount,
        currentCount: allBlogs.length,
      },
      _links,
      message: "Blogs fetched successfully",
    });
  } catch (error) {
    handleError(error, res, BLOG_ENDPOINTS.LIST_ALL_BLOGS);
  }
};
