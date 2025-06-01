import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import categoriesTable from "@/db/schema/product-management/categories/categories";
import { and, eq, not } from "drizzle-orm";
import { updateCategoryValidationSchema } from "../category.validation";
import { CATEGORY_ENDPOINTS } from "@/data/endpoints";
import slugify from "slugify";

/**
 * Updates an existing category record in the database
 * @param req Express request object
 * @param res Express response object
 */
export const updateCategoryV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = updateCategoryValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: CATEGORY_ENDPOINTS.UPDATE_CATEGORY,
      };
    }

    const { id, ...updateData } = validationResult.data;

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id));

    if (existingCategory.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Category not found",
        endpoint: CATEGORY_ENDPOINTS.UPDATE_CATEGORY,
      };
    }

    // Check for title/slug conflicts if those are being updated
    if (updateData.title) {
      const titleToCheck = updateData.title || existingCategory[0].title;

      const conflictCategory = await db
        .select()
        .from(categoriesTable)
        .where(
          and(
            eq(categoriesTable.title, titleToCheck),
            not(eq(categoriesTable.id, id)), // Exclude current category
          ),
        );

      if (conflictCategory.length > 0) {
        throw {
          type: ERROR_TYPES.CONFLICT,
          message: "Category with this title already exists",
          endpoint: CATEGORY_ENDPOINTS.UPDATE_CATEGORY,
        };
      }
    }

    // Update the category record
    const updatedCategory = await db
      .update(categoriesTable)
      .set({
        title: updateData.title || existingCategory[0].title,
        slug: !updateData.slug
          ? slugify(updateData.title || existingCategory[0].title, {
              lower: true,
              strict: true,
            })
          : updateData.slug,
        description: updateData.description || existingCategory[0].description,
        categoryLevelId:
          updateData.categoryLevelId || existingCategory[0].categoryLevelId,
        parentId: updateData.parentId || existingCategory[0].parentId,
        mediaId: updateData.mediaId || existingCategory[0].mediaId,
      })
      .where(eq(categoriesTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory[0],
    });
  } catch (error) {
    handleError(error, res, CATEGORY_ENDPOINTS.UPDATE_CATEGORY);
  }
};
