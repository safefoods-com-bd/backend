import { z } from "zod";

export const stockValidationSchema = z.object({
  quantity: z.number().min(0, "Quantity must be a non-negative number"),
  warehouseId: z
    .string({ required_error: "Warehouse ID is required" })
    .uuid("Invalid warehouse ID format"),
  variantProductId: z
    .string({ required_error: "Variant product ID is required" })
    .uuid("Invalid variant product ID format"),
});

export type StockValidationType = z.infer<typeof stockValidationSchema>;

export const updateStockValidationSchema = stockValidationSchema
  .partial()
  .extend({
    id: z
      .string({ required_error: "Stock ID is required" })
      .uuid("Invalid ID format"),
  });

export type UpdateStockValidationType = z.infer<
  typeof updateStockValidationSchema
>;

export const deleteStockValidationSchema = z.object({
  id: z
    .string({ required_error: "Stock ID is required" })
    .uuid("Invalid ID format"),
});

export type DeleteStockValidationType = z.infer<
  typeof deleteStockValidationSchema
>;

export const deleteStocksBatchValidationSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid ID format"))
    .min(1, "At least one stock ID is required"),
});

export type DeleteStocksBatchValidationType = z.infer<
  typeof deleteStocksBatchValidationSchema
>;

export const getWarehouseStocksValidationSchema = z.object({
  warehouseId: z
    .string({ required_error: "Warehouse ID is required" })
    .uuid("Invalid warehouse ID format"),
});

export type GetWarehouseStocksValidationType = z.infer<
  typeof getWarehouseStocksValidationSchema
>;
