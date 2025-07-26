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
    .number({ required_error: "Subtotal is required" })
    .min(0, "Subtotal must be non-negative"),
  discount: z
    .number({ required_error: "Discount is required" })
    .min(0, "Discount must be non-negative"),
  couponId: z.string().uuid("Invalid coupon ID format").optional(),
  afterDiscountTotal: z
    .number({ required_error: "After discount total is required" })
    .min(0, "After discount total must be non-negative"),
  deliveryCharge: z
    .number({ required_error: "Delivery charge is required" })
    .min(0, "Delivery charge must be non-negative"),
  deliveryZoneId: z
    .string({ required_error: "Delivery zone ID is required" })
    .uuid("Invalid delivery zone ID format"),
  total: z
    .number({ required_error: "Total is required" })
    .min(0, "Total must be non-negative"),
  preferredDeliveryDateAndTime: z
    .string({ required_error: "Preferred delivery date and time is required" })
    .datetime("Invalid date format for preferred delivery date and time"),
  paymentMethodId: z
    .string({ required_error: "Payment method ID is required" })
    .uuid("Invalid payment method ID format"),
  transactionNo: z.string().max(100, "Transaction number too long").optional(),
  transactionPhoneNo: z
    .string()
    .max(15, "Transaction phone number too long")
    .optional(),
  transactionDate: z
    .string()
    .datetime("Invalid date format for transaction date")
    .optional(),
  addressId: z
    .string({ required_error: "Address ID is required" })
    .uuid("Invalid address ID format"),
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
  changedBy: z
    .string({ required_error: "Changed by user ID is required" })
    .uuid("Invalid changed by user ID format")
    .optional(), // Optional for creation, defaults to userId in controller
});

// Apply refine to orderValidationSchema
export const orderValidationSchema = baseOrderSchema.refine(
  (data) => Number(data.afterDiscountTotal) <= Number(data.subTotal),
  {
    message: "After discount total must be less than or equal to subtotal",
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
    changedBy: z
      .string({ required_error: "Changed by user ID is required" })
      .uuid("Invalid changed by user ID format")
      .optional(), // Optional for updates, defaults to userId or provided value in controller
  })
  .omit({ productOrders: true }) // Product orders cannot be updated via this endpoint
  .refine(
    (data) =>
      !data.afterDiscountTotal ||
      !data.subTotal ||
      Number(data.afterDiscountTotal) <= Number(data.subTotal),
    {
      message: "After discount total must be less than or equal to subtotal",
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
