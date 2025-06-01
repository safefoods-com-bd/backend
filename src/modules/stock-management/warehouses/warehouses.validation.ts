import { z } from "zod";

export const warehouseValidationSchema = z.object({
  name: z.string({ required_error: "Warehouse name is required" }),
  location: z.string({ required_error: "Warehouse location is required" }),
  contactNumber: z.string({ required_error: "Contact number is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  isActive: z.boolean().optional().default(true),
});
export type WarehouseValidationType = z.infer<typeof warehouseValidationSchema>;

export const updateWarehouseValidationSchema = warehouseValidationSchema
  .partial()
  .extend({
    id: z
      .string({ required_error: "Warehouse ID is required" })
      .uuid("Invalid ID format"),
  });
export type UpdateWarehouseValidationType = z.infer<
  typeof updateWarehouseValidationSchema
>;

export const deleteWarehouseValidationSchema = z.object({
  id: z
    .string({ required_error: "Warehouse ID is required" })
    .uuid("Invalid ID format"),
});
export type DeleteWarehouseValidationType = z.infer<
  typeof deleteWarehouseValidationSchema
>;

export const deleteWarehousesBatchValidationSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid ID format"))
    .min(1, "At least one ID is required"),
});
export type DeleteWarehousesBatchValidationType = z.infer<
  typeof deleteWarehousesBatchValidationSchema
>;
