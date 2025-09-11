import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { eq } from "drizzle-orm";
import paymentMethodTable from "@/db/schema/order-management/payment_methods";
import { paymentMethodValidationSchema } from "../payment-methods.validation";
import { PAYMENT_METHOD_ENDPOINTS } from "@/data/endpoints";

/**
 * Updates a payment method record in the database.
 *
 * @async
 * @function updatePaymentMethodV100
 * @param {Request} req - Express request object containing the payment method update data in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response with the updated payment method data
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 * @throws {Object} Throws an error object with type NOT_FOUND if payment method with the given id doesn't exist
 *
 * @description
 * This controller handles PATCH requests to update payment method records.
 * It validates the incoming request body against updatePaymentMethodValidationSchema.
 * If validation passes, it updates the payment method record with the provided fields.
 * Only fields that are provided in the request are updated (partial update).
 * Returns a 200 status with the updated payment method record on success.
 */
export const updatePaymentMethodV100 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validation = paymentMethodValidationSchema
      .partial()
      .safeParse(req.body);

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
        endpoint: PAYMENT_METHOD_ENDPOINTS.UPDATE_PAYMENT_METHOD,
      };
    }

    if (!id) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Payment method ID is required",
        endpoint: PAYMENT_METHOD_ENDPOINTS.UPDATE_PAYMENT_METHOD,
      };
    }

    const { title, description, isActive, accountNumber } = validation.data;

    // Check if payment method exists
    const existingPaymentMethod = await db
      .select()
      .from(paymentMethodTable)
      .where(eq(paymentMethodTable.id, id))
      .limit(1);

    if (existingPaymentMethod.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Payment method not found",
        endpoint: PAYMENT_METHOD_ENDPOINTS.UPDATE_PAYMENT_METHOD,
      };
    }

    // Check if title already exists (if title is being updated)
    if (title && title !== existingPaymentMethod[0].title) {
      const titleExists = await db
        .select()
        .from(paymentMethodTable)
        .where(eq(paymentMethodTable.title, title))
        .limit(1);

      if (titleExists.length > 0) {
        throw {
          type: ERROR_TYPES.CONFLICT,
          message: "Payment method with this title already exists",
          endpoint: PAYMENT_METHOD_ENDPOINTS.UPDATE_PAYMENT_METHOD,
        };
      }
    }

    // Update payment method record
    const updatedPaymentMethod = await db
      .update(paymentMethodTable)
      .set({
        ...(title && { title }),
        ...(description && { description }),
        ...(accountNumber && { accountNumber }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      })
      .where(eq(paymentMethodTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Payment method updated successfully",
      data: updatedPaymentMethod[0],
    });
  } catch (error) {
    handleError(error, res, PAYMENT_METHOD_ENDPOINTS.UPDATE_PAYMENT_METHOD);
  }
};
