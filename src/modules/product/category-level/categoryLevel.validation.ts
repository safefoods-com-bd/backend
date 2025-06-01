// import { createInsertSchema } from "drizzle-zod";
// import { categoryLevelsTable } from "@/db/schema";
// export const createCategoryLevelSchema =
//   createInsertSchema(categoryLevelsTable);

import { z } from "zod";

export const createCategoryLevelSchema = z.object({
  title: z
    .string({ required_error: "Category level title is required" })
    .min(1, "Category level title must be at least 1 character long"),
  parentId: z.string().uuid("Invalid parent ID format").optional().nullable(),
  slug: z
    .string({ required_error: "Category level slug is required" })
    .min(1, "Category level slug must be at least 1 character long")
    .optional()
    .nullable(),
});
export type CreateCategoryLevelType = z.infer<typeof createCategoryLevelSchema>;
