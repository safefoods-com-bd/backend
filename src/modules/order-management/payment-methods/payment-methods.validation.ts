import { z } from "zod";

export const paymentMethodValidationSchema = z.object({
  title: z
    .string({ required_error: "Payment method title is required" })
    .min(1, "Title cannot be empty")
    .max(255, "Title cannot be longer than 255 characters"),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description cannot be empty"),
  isActive: z.boolean().optional().default(true),
});

export type PaymentMethodValidationType = z.infer<
  typeof paymentMethodValidationSchema
>;

export const updatePaymentMethodValidationSchema = paymentMethodValidationSchema
  .extend({
    id: z
      .string({ required_error: "Payment method ID is required" })
      .uuid("Invalid ID format"),
  })
  .partial()
  .required({ id: true });

export type UpdatePaymentMethodValidationType = z.infer<
  typeof updatePaymentMethodValidationSchema
>;

export const deletePaymentMethodValidationSchema = z.object({
  id: z
    .string({ required_error: "Payment method ID is required" })
    .uuid("Invalid ID format"),
});

export type DeletePaymentMethodValidationType = z.infer<
  typeof deletePaymentMethodValidationSchema
>;

export const deletePaymentMethodsBatchValidationSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid ID format"))
    .min(1, "At least one ID is required"),
});

export type DeletePaymentMethodsBatchValidationType = z.infer<
  typeof deletePaymentMethodsBatchValidationSchema
>;
