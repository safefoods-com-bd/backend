import { createInsertSchema } from "drizzle-zod";
import { categoryLevelsTable } from "@/db/schema";
export const createCategoryLevelSchema =
  createInsertSchema(categoryLevelsTable);
