import { z } from "zod";

export const mediaValidationSchema = z.object({
  title: z.string().optional(),
  url: z
    .string({ required_error: "Media URL is required" })
    .url("Invalid URL format"),
});
export type MediaValidationType = z.infer<typeof mediaValidationSchema>;

export const updateMediaValidationSchema = mediaValidationSchema.extend({
  id: z
    .string({ required_error: "Media ID is required" })
    .uuid("Invalid ID format"),
});
export type UpdateMediaValidationType = z.infer<
  typeof updateMediaValidationSchema
>;
export const deleteMediaValidationSchema = z.object({
  id: z
    .string({ required_error: "Media ID is required" })
    .uuid("Invalid ID format"),
});
export type DeleteMediaValidationType = z.infer<
  typeof deleteMediaValidationSchema
>;
