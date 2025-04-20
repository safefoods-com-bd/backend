import { db } from "@/db/db";
import { categoryLevelsTable } from "@/db/schema";
import { handleError } from "@/utils/errorHandler";
import { desc } from "drizzle-orm";
import { Request, Response } from "express";

export const listAllCategoryLevelsV100 = async (
  req: Request,
  res: Response,
) => {
  try {
    const categoryLevels = await db
      .select()
      .from(categoryLevelsTable)
      .orderBy(desc(categoryLevelsTable.createdAt));

    return res.status(200).json({
      success: true,
      message: "Category levels fetched successfully",
      data: categoryLevels,
    });
  } catch (error) {
    handleError(error, res);
  }
};
