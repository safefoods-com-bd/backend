import { z } from "zod";

export const categoryValidationSchema = z.object({
  title: z.string({ required_error: "Category title is required" }),
  slug: z.string().nullable().optional(),
  description: z.string().optional(),
  categoryLevelId: z
    .string()
    .uuid("Invalid category level ID format")
    .nullable()
    .optional(),
  parentId: z.string().uuid("Invalid parent ID format").nullable().optional(),
  mediaId: z.string().uuid("Invalid media ID format").nullable().optional(),
  isActive: z.boolean().optional().default(true),
});
export type CategoryValidationType = z.infer<typeof categoryValidationSchema>;

export const updateCategoryValidationSchema = categoryValidationSchema
  .partial()
  .extend({
    id: z
      .string({ required_error: "Category ID is required" })
      .uuid("Invalid ID format"),
  });
export type UpdateCategoryValidationType = z.infer<
  typeof updateCategoryValidationSchema
>;

export const deleteCategoryValidationSchema = z.object({
  id: z
    .string({ required_error: "Category ID is required" })
    .uuid("Invalid ID format"),
});
export type DeleteCategoryValidationType = z.infer<
  typeof deleteCategoryValidationSchema
>;

export const deleteCategoriesBatchValidationSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid ID format"))
    .min(1, "At least one ID is required"),
});
export type DeleteCategoriesBatchValidationType = z.infer<
  typeof deleteCategoriesBatchValidationSchema
>;

export const getSingleCategorySchema = z.object({
  id: z
    .string({ required_error: "Category ID is required" })
    .uuid("Invalid ID format"),
});
