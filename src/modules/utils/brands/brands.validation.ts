import { z } from "zod";

export const brandValidationSchema = z.object({
  title: z
    .string({ required_error: "Brand title is required" })
    .min(1, "Brand title cannot be empty"),
  mediaId: z.string().uuid("Invalid ID format").nullable().optional(),
});
export type BrandValidationType = z.infer<typeof brandValidationSchema>;

export const updateBrandValidationSchema = brandValidationSchema
  .extend({
    id: z
      .string({ required_error: "Brand ID is required" })
      .uuid("Invalid ID format"),
  })
  .partial({
    title: true,
    mediaId: true,
  });
export type UpdateBrandValidationType = z.infer<
  typeof updateBrandValidationSchema
>;

export const deleteBrandValidationSchema = z.object({
  id: z
    .string({ required_error: "Brand ID is required" })
    .uuid("Invalid ID format"),
});

export const batchDeleteBrandValidationSchema = z.object({
  ids: z.array(
    z
      .string({ required_error: "Brand ID is required" })
      .uuid("Invalid ID format"),
  ),
});
export type DeleteBrandValidationType = z.infer<
  typeof deleteBrandValidationSchema
>;
