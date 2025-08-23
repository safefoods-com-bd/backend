import { Request, Response } from "express";
import { eq, desc, count } from "drizzle-orm";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { db } from "@/db/db";
import blogCategoriesTable from "@/db/schema/blogs/blog_categories";
import { generateHateoasLinksForCollection } from "@/utils/generateHateoasLinks";

/**
 * Retrieves all blog categories with pagination
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with blog categories or error message
 */
export const getBlogCategoriesV100 = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const sort = (req.query.sort as string) || "desc";

    const query = db
      .select()
      .from(blogCategoriesTable)
      .orderBy(
        sort === "desc"
          ? desc(blogCategoriesTable.createdAt)
          : blogCategoriesTable.createdAt,
      )
      .offset(offset)
      .limit(limit);

    const data = await query;

    const totalCountQuery = db
      .select({ count: count() })
      .from(blogCategoriesTable);
    const totalCount = await totalCountQuery;

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const _links = generateHateoasLinksForCollection({
      baseUrl,
      offset,
      limit,
      totalCount: totalCount[0]?.count || 0,
    });

    return res.status(200).json({
      success: true,
      message: "Blog categories fetched successfully",
      data: data,
      pagination: {
        offset,
        limit,
        total: totalCount[0]?.count,
        currentCount: data.length,
      },
      _links,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Retrieves a single blog category by its ID
 * @param req Express request object containing the blog category ID in params
 * @param res Express response object
 * @returns JSON response with the blog category or error message
 */
export const getBlogCategoryByIdV100 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = db
      .select()
      .from(blogCategoriesTable)
      .where(eq(blogCategoriesTable.id, id));

    const data = await query;

    if (data.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Blog category not found",
      };
    }

    return res.status(200).json({
      success: true,
      message: "Blog category fetched successfully",
      data: data[0],
    });
  } catch (error) {
    handleError(error, res);
  }
};
