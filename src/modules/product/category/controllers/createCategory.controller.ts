import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import categoriesTable from "@/db/schema/product-management/categories/categories";
import { categoryValidationSchema } from "../category.validation";
import { and, eq } from "drizzle-orm";
import { CATEGORY_ENDPOINTS } from "@/data/endpoints";
import slugify from "slugify";

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

    const {
      title,
      slug,
      description,
      categoryLevelId,
      parentId,
      mediaId,
      isActive,
    } = validationResult.data;

    // Check if category with the same title or slug already exists
    const existingCategory = await db
      .select()
      .from(categoriesTable)
      .where(and(eq(categoriesTable.title, title)));

    if (existingCategory.length > 0) {
      throw {
        type: ERROR_TYPES.CONFLICT,
        message: "Category with this title/slug already exists",
        endpoint: CATEGORY_ENDPOINTS.CREATE_CATEGORY,
      };
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
        categoryLevelId,
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
