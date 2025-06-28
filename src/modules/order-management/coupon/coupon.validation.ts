import { z } from "zod";

export const couponValidationSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title cannot be empty")
    .max(255, "Title too long"),
  discount: z
    .number({ required_error: "Discount is required" })
    .positive("Discount must be positive")
    .max(999.99, "Discount too large"),
  discountType: z
    .enum(["percentage", "fixed_amount"], {
      required_error: "Discount type is required",
    })
    .default("percentage"),
  validDate: z
    .string({ required_error: "Valid date is required" })
    .min(1, "Valid date cannot be empty")
    .max(255, "Valid date too long"),
  isActive: z.boolean().optional(),
});

export type CouponValidationType = z.infer<typeof couponValidationSchema>;

export const updateCouponValidationSchema = couponValidationSchema
  .partial()
  .extend({
    id: z
      .string({ required_error: "Coupon ID is required" })
      .uuid("Invalid ID format"),
  });

export type UpdateCouponValidationType = z.infer<
  typeof updateCouponValidationSchema
>;

export const deleteCouponValidationSchema = z.object({
  id: z
    .string({ required_error: "Coupon ID is required" })
    .uuid("Invalid ID format"),
});

export type DeleteCouponValidationType = z.infer<
  typeof deleteCouponValidationSchema
>;

export const deleteCouponsBatchValidationSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid ID format"))
    .min(1, "At least one coupon ID is required"),
});

export type DeleteCouponsBatchValidationType = z.infer<
  typeof deleteCouponsBatchValidationSchema
>;

export const getCouponsValidationSchema = z.object({
  limit: z.coerce.number().int().min(1).default(10).optional(),
  offset: z.coerce.number().int().min(0).default(0).optional(),
  sort: z.enum(["asc", "desc"]).default("desc").optional(),
  isActive: z.coerce.boolean().optional(),
});

export type GetCouponsValidationType = z.infer<
  typeof getCouponsValidationSchema
>;
