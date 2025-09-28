import { z } from "zod";
import { variantProductValidationSchema } from "../variant-products/variant-products.validation";

export const productValidationSchema = z.object({
  title: z
    .string({ required_error: "Product title is required" })
    .min(1, "Product title cannot be empty"),
  slug: z.string().optional(),
  sku: z
    .string({ required_error: "SKU is required" })
    .min(1, "SKU cannot be empty"),
  season: z.string().optional(),
  categoryId: z
    .string({ required_error: "Category ID is required" })
    .uuid("Invalid category ID format"),
  brandId: z.string().uuid("Invalid brand ID format").nullable().optional(),
  isActive: z.boolean().optional().default(true),
  // Optional variants array for product creation; each variant omits productId (set server-side)
  variants: z
    .array(variantProductValidationSchema.omit({ productId: true }))
    .optional(),
});
export type ProductValidationType = z.infer<typeof productValidationSchema>;

export const updateProductValidationSchema = productValidationSchema
  .extend({
    id: z
      .string({ required_error: "Product ID is required" })
      .uuid("Invalid ID format"),
  })
  .partial({
    title: true,
    slug: true,
    sku: true,
    season: true,
    categoryId: true,
    brandId: true,
    isActive: true,
  });
export type UpdateProductValidationType = z.infer<
  typeof updateProductValidationSchema
>;

export const deleteProductValidationSchema = z.object({
  id: z
    .string({ required_error: "Product ID is required" })
    .uuid("Invalid ID format"),
});

export const batchDeleteProductValidationSchema = z.object({
  ids: z.array(
    z
      .string({ required_error: "Product ID is required" })
      .uuid("Invalid ID format"),
  ),
});
export type DeleteProductValidationType = z.infer<
  typeof deleteProductValidationSchema
>;
