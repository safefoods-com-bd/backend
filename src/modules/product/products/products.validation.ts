import { z } from "zod";
import {
  updateVariantProductValidationSchema,
  variantProductValidationSchema,
} from "../variant-products/variant-products.validation";

export const productValidationSchema = z.object({
  title: z
    .string({ required_error: "Product title is required" })
    .min(1, "Product title cannot be empty"),
  slug: z.string().optional(),
  sku: z.string().optional().nullable(),
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

const existingVariantSchema = updateVariantProductValidationSchema
  .omit({ productId: true })
  .extend({
    id: z.string().uuid("Variant ID must be a valid UUID"),
  });

// For new variants, the ID is either not present or an empty string.
// And other fields are required.
const newVariantSchema = variantProductValidationSchema
  .omit({ productId: true })
  .extend({
    id: z.union([z.literal(""), z.undefined()]).optional(),
  });

export const updateProductValidationSchema = z.object({
  id: z
    .string({ required_error: "Product ID is required" })
    .uuid("Invalid ID format"),
  title: z
    .string({ required_error: "Product title is required" })
    .min(1, "Product title cannot be empty"),
  slug: z.string().optional(),
  sku: z.string().optional().nullable(),
  season: z.string().optional(),
  categoryId: z
    .string({ required_error: "Category ID is required" })
    .uuid("Invalid category ID format"),
  brandId: z.string().uuid("Invalid brand ID format").nullable().optional(),
  isActive: z.boolean().optional().default(true),
  // Optional variants array for product creation; each variant omits productId (set server-side)
  variants: z
    .array(z.union([existingVariantSchema, newVariantSchema]))
    .optional(),
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

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string | null;
  season: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  brandId: string | null;
  categoryTitle: string | null;
  brandTitle: string | null;
}
