import { z } from "zod";

export const unitValidationSchema = z.object({
  code: z.string({ required_error: "Unit code is required" }),
  title: z.string({ required_error: "Unit title is required" }),
  baseUnit: z.string().nullable().optional(),
  operator: z.string().nullable().optional(),
  operationValue: z.string().nullable().optional(),
});
export type UnitValidationType = z.infer<typeof unitValidationSchema>;

export const updateUnitValidationSchema = unitValidationSchema.extend({
  id: z
    .string({ required_error: "Unit ID is required" })
    .uuid("Invalid ID format"),
});
export type UpdateUnitValidationType = z.infer<
  typeof updateUnitValidationSchema
>;

export const deleteUnitValidationSchema = z.object({
  id: z
    .string({ required_error: "Unit ID is required" })
    .uuid("Invalid ID format"),
});
export type DeleteUnitValidationType = z.infer<
  typeof deleteUnitValidationSchema
>;

export const deleteUnitsBatchValidationSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid ID format"))
    .min(1, "At least one ID is required"),
});
export type DeleteUnitsBatchValidationType = z.infer<
  typeof deleteUnitsBatchValidationSchema
>;
