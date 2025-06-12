import { Request, Response } from "express";
import { db } from "@/db/db";
import paymentMethodTable from "@/db/schema/order-management/payment_methods";
import { eq } from "drizzle-orm";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { PAYMENT_METHOD_ENDPOINTS } from "@/data/endpoints";

/**
 * Controller function to retrieve a single payment method by ID.
 *
 * @param req - Express Request object containing the payment method ID in params
 * @param res - Express Response object
 *
 * @returns JSON response with:
 *   - success: Boolean indicating if the operation was successful
 *   - data: Payment method record object
 *   - message: Success message
 *
 * @throws Handles and processes any errors using the handleError utility function
 */
export const getSinglePaymentMethodV100 = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Payment method ID is required",
      };
    }

    const paymentMethod = await db
      .select()
      .from(paymentMethodTable)
      .where(eq(paymentMethodTable.id, id))
      .limit(1);

    if (paymentMethod.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Payment method not found",
      };
    }

    return res.status(200).json({
      success: true,
      data: paymentMethod[0],
      message: "Payment method fetched successfully",
    });
  } catch (error) {
    handleError(error, res, PAYMENT_METHOD_ENDPOINTS.GET_SINGLE_PAYMENT_METHOD);
  }
};
