import { z } from "zod";

export const cartValidationSchema = z.object({
  userId: z
    .string({ required_error: "User ID is required" })
    .uuid("Invalid user ID format"),
  variantProductId: z
    .string({ required_error: "Variant product ID is required" })
    .uuid("Invalid variant product ID format"),
  quantity: z
    .number({ required_error: "Quantity is required" })
    .int("Quantity must be an integer"),
  // .positive("Quantity must be positive"),
  addedToCheckOut: z.boolean().optional(),
  isPurchased: z.boolean().optional(),
  isDiscarded: z.boolean().optional(),
});
export type CartValidationType = z.infer<typeof cartValidationSchema>;

export const updateCartValidationSchema = z
  .object({
    id: z
      .string({ required_error: "Cart item ID is required" })
      .uuid("Invalid ID format"),
    userId: z.string().uuid("Invalid user ID format").optional(),
    variantProductId: z
      .string()
      .uuid("Invalid variant product ID format")
      .optional(),
    quantity: z
      .number()
      .int("Quantity must be an integer")
      .positive("Quantity must be positive")
      .optional(),
    addedToCheckOut: z.boolean().optional(),
    isPurchased: z.boolean().optional(),
    isDiscarded: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // At least one field other than id must be provided for update
      return Object.keys(data).some(
        (key) => key !== "id" && data[key as keyof typeof data] !== undefined,
      );
    },
    {
      message: "At least one field to update must be provided",
    },
  );
export type UpdateCartValidationType = z.infer<
  typeof updateCartValidationSchema
>;

export const deleteCartValidationSchema = z.object({
  id: z
    .string({ required_error: "Cart item ID is required" })
    .uuid("Invalid ID format"),
});
export type DeleteCartValidationType = z.infer<
  typeof deleteCartValidationSchema
>;

export const batchDeleteCartValidationSchema = z.object({
  ids: z.array(
    z
      .string({ required_error: "Cart item ID is required" })
      .uuid("Invalid ID format"),
  ),
});
export type BatchDeleteCartValidationType = z.infer<
  typeof batchDeleteCartValidationSchema
>;
