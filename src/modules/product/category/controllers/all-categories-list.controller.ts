import { db } from "@/db/db";
import categoriesTable from "@/db/schema/product-management/categories/categories";
import categoryLevelsTable from "@/db/schema/product-management/categories/category_levels";
import { eq, sql } from "drizzle-orm";
import { Request, Response } from "express";
import { handleError } from "@/utils/errorHandler";
import { generateHateoasLinksForCollection } from "@/utils/generateHateoasLinks";
import { CATEGORY_ENDPOINTS } from "@/data/endpoints";
import { CategoryRecord, CategoryWithChildren } from "../category.types";
import { mediaTable } from "@/db/schema";

/**
 * Controller function to retrieve categories data with pagination and HATEOAS links.
 *
 * @param req - Express Request object containing query parameters:
 *   - limit: (optional) Number of records to return per page, defaults to 10
 *   - offset: (optional) Number of records to skip, defaults to 0
 *   - sort: (optional) Sort order, defaults to "desc"
 *   - isActive: (optional) Filter by active status
 *
 * @param res - Express Response object
 *
 * @returns JSON response with:
 *   - success: Boolean indicating if the operation was successful
 *   - data: Array of category records
 *   - pagination: Object containing pagination details (offset, limit, total, currentCount)
 *   - _links: HATEOAS links for navigating the collection
 *   - message: Success message
 */
export const allCategoriesListV100 = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const sort = (req.query.sort as string) || "desc";
    const search = (req.query.search as string) || "";
    const isActive =
      req.query.isActive !== undefined
        ? req.query.isActive === "true"
        : undefined;

    // Build where conditions
    const whereConditions = [];
    if (isActive !== undefined) {
      whereConditions.push(eq(categoriesTable.isActive, isActive));
    }
    if (search) {
      whereConditions.push(
        sql`LOWER(${categoriesTable.title}) LIKE LOWER(${"%" + search + "%"})`,
      );
    }

    // First, fetch all categories along with their category levels
    const allCategories = await db
      .select({
        id: categoriesTable.id,
        title: categoriesTable.title,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        mediaId: categoriesTable.mediaId,
        mediaUrl: mediaTable.url,
        isActive: categoriesTable.isActive,
        createdAt: categoriesTable.createdAt,
        updatedAt: categoriesTable.updatedAt,
        levelId: categoryLevelsTable.id,
        levelTitle: categoryLevelsTable.title,
        levelSlug: categoryLevelsTable.slug,
        parentId: categoriesTable.parentId,
      })
      .from(categoriesTable)
      .leftJoin(
        categoryLevelsTable,
        eq(categoriesTable.categoryLevelId, categoryLevelsTable.id),
      )
      .leftJoin(mediaTable, eq(mediaTable.id, categoriesTable.mediaId))
      .where(
        whereConditions.length > 0
          ? sql`${sql.join(whereConditions, sql` AND `)}`
          : undefined,
      );

    // Create a map of category IDs to their details
    const categoryDetailsMap = new Map(
      allCategories.map((category) => [
        category.id,
        { title: category.title, slug: category.slug },
      ]),
    );

    // Add parent details to each category
    const categoriesWithParentDetails = allCategories.map((category) => ({
      ...category,
      parentTitle: category.parentId
        ? categoryDetailsMap.get(category.parentId)?.title || null
        : null,
      parentSlug: category.parentId
        ? categoryDetailsMap.get(category.parentId)?.slug || null
        : null,
    }));

    // Get the total count for pagination (count only root categories)
    const totalCount = categoriesWithParentDetails.length;

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
      data: categoriesWithParentDetails,
      pagination: {
        offset,
        limit,
        total: totalCount,
        currentCount: categoriesWithParentDetails.length,
      },
      _links,
      message: "Categories fetched successfully",
    });
  } catch (error) {
    handleError(error, res, CATEGORY_ENDPOINTS.LIST_ALL_CATEGORIES);
  }
};
