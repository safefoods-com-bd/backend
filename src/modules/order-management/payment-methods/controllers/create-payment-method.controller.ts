import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import paymentMethodTable from "@/db/schema/order-management/payment_methods";
import { paymentMethodValidationSchema } from "../payment-methods.validation";
import { eq } from "drizzle-orm";
import { PAYMENT_METHOD_ENDPOINTS } from "@/data/endpoints";

/**
 * Creates a new payment method record in the database
 * @param req Express request object
 * @param res Express response object
 */
export const createPaymentMethodV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = paymentMethodValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: PAYMENT_METHOD_ENDPOINTS.CREATE_PAYMENT_METHOD,
      };
    }

    const { title, description, accountNumber } = validationResult.data;

    // Check if payment method with same title already exists
    const existingPaymentMethod = await db
      .select()
      .from(paymentMethodTable)
      .where(eq(paymentMethodTable.title, title))
      .limit(1);

    if (
      existingPaymentMethod.length > 0 &&
      existingPaymentMethod[0].isDeleted === false
    ) {
      throw {
        type: ERROR_TYPES.CONFLICT,
        message: "Payment method with this title already exists",
        endpoint: PAYMENT_METHOD_ENDPOINTS.CREATE_PAYMENT_METHOD,
      };
    }
    if (
      existingPaymentMethod.length > 0 &&
      existingPaymentMethod[0].isDeleted === true
    ) {
      throw {
        type: ERROR_TYPES.CONFLICT,
        message:
          "Payment method with this title already exists but is deleted. Please restore it instead of creating a new one.",
        endpoint: PAYMENT_METHOD_ENDPOINTS.CREATE_PAYMENT_METHOD,
      };
    }

    // Create payment method record
    const newPaymentMethod = await db
      .insert(paymentMethodTable)
      .values({
        title,
        description,
        accountNumber,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Payment method created successfully",
      data: newPaymentMethod[0],
    });
  } catch (error) {
    console.error("Error creating payment method:", error);
    handleError(error, res, PAYMENT_METHOD_ENDPOINTS.CREATE_PAYMENT_METHOD);
  }
};
