import { validateZodSchema } from "@/middleware/validationMiddleware";
import { Request, Response } from "express";
import { createCategoryLevelSchema } from "../categoryLevel.validation";
import { db } from "@/db/db";
import { categoryLevelsTable } from "@/db/schema";
import slugify from "slugify";
import { handleError } from "@/utils/errorHandler";
import { eq } from "drizzle-orm";

export const createCategoryLevelV100 = async (req: Request, res: Response) => {
  try {
    const { title, parentId } = await validateZodSchema(
      createCategoryLevelSchema,
    )(req.body);
    //--------------------------------------
    // Check if the title is already in use
    //--------------------------------------
    const categoryLevelExists = await db
      .select()
      .from(categoryLevelsTable)
      .where(eq(categoryLevelsTable.title, title))
      .limit(1);

    if (categoryLevelExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Category level with this title already exists",
      });
    }
    //--------------------------------------
    // Check if the parentId is valid
    //--------------------------------------
    if (parentId) {
      const parentCategoryLevelExists = await db
        .select()
        .from(categoryLevelsTable)
        .where(eq(categoryLevelsTable.id, parentId))
        .limit(1);
      if (parentCategoryLevelExists.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Parent category level not found",
        });
      }
    }
    //--------------------------------------
    // Create the new category level
    //--------------------------------------

    const newCategoryLevel = await db
      .insert(categoryLevelsTable)
      .values({
        title,
        slug: slugify(title, {
          lower: true,
          strict: true,
        }),
        parentId,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Category level created successfully",
      data: newCategoryLevel[0],
    });
  } catch (error) {
    handleError(error, res);
  }
};
