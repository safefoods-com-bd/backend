import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import categoriesTable from "@/db/schema/product-management/categories/categories";
import { categoryValidationSchema } from "../category.validation";
import { eq, or } from "drizzle-orm";
import { CATEGORY_ENDPOINTS } from "@/data/endpoints";
import slugify from "slugify";
import { categoryLevelsTable } from "@/db/schema";
import { categoryLevels } from "@/constants/categoryLevels";

/**
 * Creates a new category record in the database
 * @param req Express request object
 * @param res Express response object
 */
export const createCategoryV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = categoryValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: CATEGORY_ENDPOINTS.CREATE_CATEGORY,
      };
    }

    const { title, slug, description, parentId, mediaId, isActive } =
      validationResult.data;

    // Check if category with the same title or slug already exists
    const existingCategory = await db
      .select()
      .from(categoriesTable)
      .where(
        or(
          eq(categoriesTable.title, title),
          eq(
            categoriesTable.slug,
            slug !== undefined && slug !== null
              ? slug
              : slugify(title, { lower: true, strict: true }),
          ),
        ),
      );

    if (existingCategory.length > 0) {
      throw {
        type: ERROR_TYPES.CONFLICT,
        message: "Category with this title/slug already exists",
        endpoint: CATEGORY_ENDPOINTS.CREATE_CATEGORY,
      };
    }

    ///get the category id of the parent id ,
    let parentCategoryLevelId: string | null = null;
    if (parentId) {
      const categoryLevelIdOfParentCategory = await db
        .select({
          id: categoriesTable.id,
          categoryLevelId: categoriesTable.categoryLevelId,
        })
        .from(categoriesTable)
        .where(eq(categoriesTable.id, parentId))
        .limit(1)
        .execute();

      if (categoryLevelIdOfParentCategory.length === 0) {
        throw {
          type: ERROR_TYPES.NOT_FOUND,
          message: "Parent category not found",
          endpoint: CATEGORY_ENDPOINTS.CREATE_CATEGORY,
        };
      }
      parentCategoryLevelId =
        categoryLevelIdOfParentCategory[0].categoryLevelId;
    } else {
      // categoryLevelId of the "level_1"
      const categoryLevelIdOfLevel1 = await db
        .select({ id: categoryLevelsTable.id })
        .from(categoryLevelsTable)
        .where(eq(categoryLevelsTable.title, categoryLevels.LEVEL_1))
        .limit(1)
        .execute();
      if (categoryLevelIdOfLevel1.length === 0) {
        throw {
          type: ERROR_TYPES.NOT_FOUND,
          message: "Category level 'level_1' not found",
          endpoint: CATEGORY_ENDPOINTS.CREATE_CATEGORY,
        };
      }
      parentCategoryLevelId = categoryLevelIdOfLevel1[0].id;
    }

    // Create category record
    const newCategory = await db
      .insert(categoriesTable)
      .values({
        title,
        slug: !slug
          ? slugify(title, {
              lower: true,
              strict: true,
            })
          : slug,
        description,
        categoryLevelId: parentCategoryLevelId,
        parentId,
        mediaId,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory[0],
    });
  } catch (error) {
    handleError(error, res, CATEGORY_ENDPOINTS.CREATE_CATEGORY);
  }
};
