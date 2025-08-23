import { z } from "zod";

export const blogCategoryValidationSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title cannot be empty")
    .max(255, "Title too long"),
  slug: z
    .string({ required_error: "Slug is required" })
    .min(1, "Slug cannot be empty")
    .max(255, "Slug too long"),
});

export type BlogCategoryValidationType = z.infer<
  typeof blogCategoryValidationSchema
>;

export const updateBlogCategoryValidationSchema = blogCategoryValidationSchema
  .partial()
  .extend({
    id: z
      .string({ required_error: "Blog category ID is required" })
      .uuid("Invalid ID format"),
  });

export type UpdateBlogCategoryValidationType = z.infer<
  typeof updateBlogCategoryValidationSchema
>;

export const deleteBlogCategoryValidationSchema = z.object({
  id: z
    .string({ required_error: "Blog category ID is required" })
    .uuid("Invalid ID format"),
});

export type DeleteBlogCategoryValidationType = z.infer<
  typeof deleteBlogCategoryValidationSchema
>;

export const deleteBlogCategoriesBatchValidationSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid ID format"))
    .min(1, "At least one blog category ID is required"),
});

export type DeleteBlogCategoriesBatchValidationType = z.infer<
  typeof deleteBlogCategoriesBatchValidationSchema
>;
