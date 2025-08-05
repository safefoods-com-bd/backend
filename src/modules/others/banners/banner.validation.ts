import { z } from "zod";

export const bannerValidationSchema = z.object({
  title: z.string({ required_error: "Banner title is required" }),
  mediaId: z.string().uuid("Invalid media ID format").nullable().optional(),
  variantProductId: z
    .string()
    .uuid("Invalid variant product ID format")
    .nullable()
    .optional(),
});
export type BannerValidationType = z.infer<typeof bannerValidationSchema>;

export const updateBannerValidationSchema = bannerValidationSchema
  .partial()
  .extend({
    id: z
      .string({ required_error: "Banner ID is required" })
      .uuid("Invalid ID format"),
    updatedAt: z.date().optional(),
  });
export type UpdateBannerValidationType = z.infer<
  typeof updateBannerValidationSchema
>;

export const deleteBannerValidationSchema = z.object({
  id: z
    .string({ required_error: "Banner ID is required" })
    .uuid("Invalid ID format"),
});
export type DeleteBannerValidationType = z.infer<
  typeof deleteBannerValidationSchema
>;

export const deleteBannersBatchValidationSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid ID format"))
    .min(1, "At least one ID is required"),
});
export type DeleteBannersBatchValidationType = z.infer<
  typeof deleteBannersBatchValidationSchema
>;

export const getSingleBannerSchema = z.object({
  id: z
    .string({ required_error: "Banner ID is required" })
    .uuid("Invalid ID format"),
});
export type GetSingleBannerValidationType = z.infer<
  typeof getSingleBannerSchema
>;
