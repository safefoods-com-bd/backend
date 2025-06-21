import { z } from "zod";

const paymentStatusEnum = z.enum(["paid", "unpaid", "refunded", "failed"]);
const orderStatusEnum = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

const productOrderSchema = z.object({
  variantProductId: z
    .string({ required_error: "Variant product ID is required" })
    .uuid("Invalid variant product ID format"),
  warehouseId: z
    .string({ required_error: "Warehouse ID is required" })
    .uuid("Invalid warehouse ID format"),
  price: z
    .string({ required_error: "Price is required" })
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Price must be a valid number with up to 2 decimal places",
    ),
  quantity: z
    .string({ required_error: "Quantity is required" })
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Quantity must be a valid number with up to 2 decimal places",
    ),
});

// Define base schema without refine
const baseOrderSchema = z.object({
  subTotal: z
    .string({ required_error: "Subtotal is required" })
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Subtotal must be a valid number with up to 2 decimal places",
    ),
  total: z
    .string({ required_error: "Total is required" })
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Total must be a valid number with up to 2 decimal places",
    ),
  afterDiscountTotal: z
    .string({ required_error: "After discount total is required" })
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "After discount total must be a valid number with up to 2 decimal places",
    ),
  paymentStatus: paymentStatusEnum.default("unpaid"),
  orderStatus: orderStatusEnum
    .default("pending")
    .refine((val) => !["shipped", "delivered"].includes(val), {
      message: "Initial order status cannot be shipped or delivered",
    }),
  productOrders: z
    .array(productOrderSchema)
    .min(1, "At least one product order is required"),
  userId: z
    .string({ required_error: "User ID is required" })
    .uuid("Invalid user ID format"),
});

// Apply refine to orderValidationSchema
export const orderValidationSchema = baseOrderSchema.refine(
  (data) => Number(data.afterDiscountTotal) <= Number(data.total),
  {
    message: "After discount total must be less than or equal to total",
    path: ["afterDiscountTotal"],
  },
);

export type OrderValidationType = z.infer<typeof orderValidationSchema>;

// Use baseOrderSchema for update schema to avoid ZodEffects
export const updateOrderValidationSchema = baseOrderSchema
  .partial()
  .extend({
    id: z
      .string({ required_error: "Order ID is required" })
      .uuid("Invalid ID format"),
  })
  .omit({ productOrders: true }) // Product orders cannot be updated via this endpoint
  .refine(
    (data) =>
      !data.afterDiscountTotal ||
      !data.total ||
      Number(data.afterDiscountTotal) <= Number(data.total),
    {
      message: "After discount total must be less than or equal to total",
      path: ["afterDiscountTotal"],
    },
  );

export type UpdateOrderValidationType = z.infer<
  typeof updateOrderValidationSchema
>;

export const deleteOrderValidationSchema = z.object({
  id: z
    .string({ required_error: "Order ID is required" })
    .uuid("Invalid ID format"),
});

export type DeleteOrderValidationType = z.infer<
  typeof deleteOrderValidationSchema
>;

export const deleteOrdersBatchValidationSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid ID format"))
    .min(1, "At least one order ID is required"),
});

export type DeleteOrdersBatchValidationType = z.infer<
  typeof deleteOrdersBatchValidationSchema
>;

export const getUserOrdersValidationSchema = z.object({
  userId: z
    .string({ required_error: "User ID is required" })
    .uuid("Invalid user ID format"),
});

export type GetUserOrdersValidationType = z.infer<
  typeof getUserOrdersValidationSchema
>;
