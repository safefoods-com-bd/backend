import { z } from "zod";

export const sliderValidationSchema = z.object({
  title: z.string({ required_error: "Slider title is required" }),
  mediaUrl: z.string().url("Invalid media URL format").nullable().optional(),
  variantProductId: z
    .string()
    .uuid("Invalid variant product ID format")
    .nullable()
    .optional(),
});
export type SliderValidationType = z.infer<typeof sliderValidationSchema>;

export const updateSliderValidationSchema = sliderValidationSchema
  .partial()
  .extend({
    id: z
      .string({ required_error: "Slider ID is required" })
      .uuid("Invalid ID format"),
    updatedAt: z.date().optional(),
  });
export type UpdateSliderValidationType = z.infer<
  typeof updateSliderValidationSchema
>;

export const deleteSliderValidationSchema = z.object({
  id: z
    .string({ required_error: "Slider ID is required" })
    .uuid("Invalid ID format"),
});
export type DeleteSliderValidationType = z.infer<
  typeof deleteSliderValidationSchema
>;

export const deleteSlidersBatchValidationSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid ID format"))
    .min(1, "At least one ID is required"),
});
export type DeleteSlidersBatchValidationType = z.infer<
  typeof deleteSlidersBatchValidationSchema
>;

export const getSingleSliderSchema = z.object({
  id: z
    .string({ required_error: "Slider ID is required" })
    .uuid("Invalid ID format"),
});
export type GetSingleSliderValidationType = z.infer<
  typeof getSingleSliderSchema
>;
