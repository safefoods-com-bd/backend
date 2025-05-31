import { z } from "zod";

export const colorValidationSchema = z.object({
  title: z
    .string({ required_error: "Color title is required" })
    .min(1, "Color title cannot be empty"),
  colorCode: z
    .string({ required_error: "Color code is required" })
    .min(3, "Color code must be at least 3 characters"),
});
export type ColorValidationType = z.infer<typeof colorValidationSchema>;

export const updateColorValidationSchema = colorValidationSchema
  .extend({
    id: z
      .string({ required_error: "Color ID is required" })
      .uuid("Invalid ID format"),
  })
  .partial({
    title: true,
    colorCode: true,
  });
export type UpdateColorValidationType = z.infer<
  typeof updateColorValidationSchema
>;

export const deleteColorValidationSchema = z.object({
  id: z
    .string({ required_error: "Color ID is required" })
    .uuid("Invalid ID format"),
});

export const batchDeleteColorValidationSchema = z.object({
  ids: z.array(
    z
      .string({ required_error: "Color ID is required" })
      .uuid("Invalid ID format"),
  ),
});
export type DeleteColorValidationType = z.infer<
  typeof deleteColorValidationSchema
>;
