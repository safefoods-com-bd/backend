import { z } from "zod";

export const variantProductValidationSchema = z.object({
  price: z.number({
    required_error: "Price is required",
  }),
  originalPrice: z.number().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  bestDeal: z.boolean().optional().default(false),
  discountedSale: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  productId: z
    .string({ required_error: "Product ID is required" })
    .uuid("Invalid product ID format"),
  colorId: z.string().uuid("Invalid color ID format").optional(),
  unitId: z
    .string({ required_error: "Unit ID is required" })
    .uuid("Invalid unit ID format"),
});
export type VariantProductValidationType = z.infer<
  typeof variantProductValidationSchema
>;

export const updateVariantProductValidationSchema =
  variantProductValidationSchema
    .extend({
      id: z
        .string({ required_error: "Variant Product ID is required" })
        .uuid("Invalid ID format"),
    })
    .partial({
      price: true,
      originalPrice: true,
      description: true,
      shortDescription: true,
      bestDeal: true,
      discountedSale: true,
      isActive: true,
      productId: true,
      colorId: true,
      unitId: true,
    });
export type UpdateVariantProductValidationType = z.infer<
  typeof updateVariantProductValidationSchema
>;

export const deleteVariantProductValidationSchema = z.object({
  id: z
    .string({ required_error: "Variant Product ID is required" })
    .uuid("Invalid ID format"),
});

export const batchDeleteVariantProductValidationSchema = z.object({
  ids: z.array(
    z
      .string({ required_error: "Variant Product ID is required" })
      .uuid("Invalid ID format"),
  ),
});
export type DeleteVariantProductValidationType = z.infer<
  typeof deleteVariantProductValidationSchema
>;
