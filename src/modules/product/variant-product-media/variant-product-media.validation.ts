import { z } from "zod";

export const variantProductMediaValidationSchema = z.object({
  variantProductId: z
    .string({ required_error: "Variant Product ID is required" })
    .uuid("Invalid variant product ID format"),
  mediaId: z
    .string({ required_error: "Media ID is required" })
    .uuid("Invalid media ID format"),
});

export type VariantProductMediaValidationType = z.infer<
  typeof variantProductMediaValidationSchema
>;

export const deleteVariantProductMediaValidationSchema = z.object({
  id: z.string({ required_error: "ID is required" }).uuid("Invalid ID format"),
});

export const deleteAllMediaFromVariantProductValidationSchema = z.object({
  variantProductId: z
    .string({ required_error: "Variant Product ID is required" })
    .uuid("Invalid variant product ID format"),
});

export const updateVariantProductMediaValidationSchema = z.object({
  id: z
    .string({ required_error: "Association ID is required" })
    .uuid("Invalid ID format"),
  mediaId: z
    .string({ required_error: "New Media ID is required" })
    .uuid("Invalid media ID format"),
});
