import { z } from "zod";

export const blogValidationSchema = z.object({
  title: z.string({ required_error: "Blog title is required" }),
  slug: z
    .string({ required_error: "Blog slug is required" })
    .min(1, "Slug cannot be empty")
    .max(255, "Slug cannot exceed 255 characters"),
  content: z.string({ required_error: "Content is required" }),
  authorName: z.string({ required_error: "Author name is required" }),
  blogCategoryId: z
    .string()
    .uuid("Invalid blog category ID format")
    .nullable()
    .optional(),
  mediaId: z.string().uuid("Invalid media ID format").nullable().optional(),
});
export type BlogValidationType = z.infer<typeof blogValidationSchema>;

export const updateBlogValidationSchema = blogValidationSchema.partial();

export type UpdateBlogValidationType = z.infer<
  typeof updateBlogValidationSchema
>;

export const deleteBlogValidationSchema = z.object({
  id: z
    .string({ required_error: "Blog ID is required" })
    .uuid("Invalid ID format"),
});
export type DeleteBlogValidationType = z.infer<
  typeof deleteBlogValidationSchema
>;

export const deleteBlogsBatchValidationSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid ID format"))
    .min(1, "At least one ID is required"),
});
export type DeleteBlogsBatchValidationType = z.infer<
  typeof deleteBlogsBatchValidationSchema
>;

export const getSingleBlogSchema = z.object({
  id: z
    .string({ required_error: "Blog ID is required" })
    .uuid("Invalid ID format"),
});
