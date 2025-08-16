import { db } from "@/db/db";
import categoriesTable from "@/db/schema/product-management/categories/categories";
import categoryLevelsTable from "@/db/schema/product-management/categories/category_levels";
import { eq } from "drizzle-orm";
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
export const listAllCategoriesV100 = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const sort = (req.query.sort as string) || "desc";
    const isActive =
      req.query.isActive !== undefined
        ? req.query.isActive === "true"
        : undefined;

    // First, fetch all categories along with their category levels
    const allCategories = await db
      .select({
        id: categoriesTable.id,
        title: categoriesTable.title,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        parentId: categoriesTable.parentId,
        mediaId: categoriesTable.mediaId,
        mediaUrl: mediaTable.url,
        isActive: categoriesTable.isActive,
        createdAt: categoriesTable.createdAt,
        updatedAt: categoriesTable.updatedAt,
        levelId: categoryLevelsTable.id,
        levelTitle: categoryLevelsTable.title,
        levelSlug: categoryLevelsTable.slug,
      })
      .from(categoriesTable)
      .leftJoin(
        categoryLevelsTable,
        eq(categoriesTable.categoryLevelId, categoryLevelsTable.id),
      )
      .leftJoin(mediaTable, eq(mediaTable.id, categoriesTable.mediaId))
      .where(
        isActive !== undefined
          ? eq(categoriesTable.isActive, isActive)
          : undefined,
      );

    // Define interfaces for category types

    // Function to build hierarchical structure
    const buildCategoryHierarchy = (categories: CategoryRecord[]) => {
      const categoryMap = new Map<string, CategoryWithChildren>();

      // First, map all categories by their ID for easy access
      categories.forEach((category) => {
        categoryMap.set(category.id, {
          ...category,
          children: [],
        });
      });

      // Build the tree structure

      const rootCategories: CategoryWithChildren[] = [];
      categories.forEach((category) => {
        const categoryWithChildren = categoryMap.get(category.id);

        if (category.parentId) {
          // If category has a parent, add it to parent's children
          const parent = categoryMap.get(category.parentId);
          if (parent && categoryWithChildren) {
            parent.children.push(categoryWithChildren);
          }
        } else {
          // If no parent, it's a root category
          if (categoryWithChildren) {
            rootCategories.push(categoryWithChildren);
          }
        }
      });

      return rootCategories;
    };

    // Apply pagination to the root categories (level_01)
    const rootCategories = allCategories.filter(
      (c) => c.levelSlug === "level_01" || c.parentId === null,
    );

    // Apply sorting
    if (sort === "desc") {
      rootCategories.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      rootCategories.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }

    // Apply pagination
    const paginatedRootCategories = rootCategories.slice(
      offset,
      offset + limit,
    );

    // Build hierarchical structure starting from paginated root categories
    const hierarchicalCategories = buildCategoryHierarchy(allCategories);
    const paginatedHierarchy = hierarchicalCategories.filter((cat) =>
      paginatedRootCategories.some((rootCat) => rootCat.id === cat.id),
    );

    // Get the total count for pagination (count only root categories)
    const totalCount = rootCategories.length;

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
      data: paginatedHierarchy,
      pagination: {
        offset,
        limit,
        total: totalCount,
        currentCount: paginatedHierarchy.length,
      },
      _links,
      message: "Categories fetched successfully",
    });
  } catch (error) {
    handleError(error, res, CATEGORY_ENDPOINTS.LIST_ALL_CATEGORIES);
  }
};
