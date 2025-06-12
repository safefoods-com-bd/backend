import { Request, Response } from "express";
import { eq, inArray } from "drizzle-orm";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { db } from "@/db/db";
import paymentMethodTable from "@/db/schema/order-management/payment_methods";
import { deletePaymentMethodsBatchValidationSchema } from "../payment-methods.validation";
import { PAYMENT_METHOD_ENDPOINTS } from "@/data/endpoints";

/**
 * Soft deletes a single payment method record from the database by ID
 * @param req Express request object
 * @param res Express response object
 */
export const deletePaymentMethodSingleV100 = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Payment method ID is required",
        endpoint: PAYMENT_METHOD_ENDPOINTS.DELETE_PAYMENT_METHOD,
      };
    }

    // Check if payment method exists and is not already deleted
    const existingPaymentMethod = await db
      .select()
      .from(paymentMethodTable)
      .where(eq(paymentMethodTable.id, id))
      .limit(1);

    if (existingPaymentMethod.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Payment method not found",
        endpoint: PAYMENT_METHOD_ENDPOINTS.DELETE_PAYMENT_METHOD,
      };
    }

    if (existingPaymentMethod[0].isDeleted) {
      throw {
        type: ERROR_TYPES.CONFLICT,
        message: "Payment method is already deleted",
        endpoint: PAYMENT_METHOD_ENDPOINTS.DELETE_PAYMENT_METHOD,
      };
    }

    // Soft delete payment method record
    const deletedPaymentMethod = await db
      .update(paymentMethodTable)
      .set({
        isDeleted: true,
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(paymentMethodTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Payment method deleted successfully",
      data: deletedPaymentMethod[0],
    });
  } catch (error) {
    handleError(error, res, PAYMENT_METHOD_ENDPOINTS.DELETE_PAYMENT_METHOD);
  }
};

/**
 * Soft deletes multiple payment method records from the database by IDs array
 * @param req Express request object
 * @param res Express response object
 */
export const deletePaymentMethodsBatchV100 = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation = deletePaymentMethodsBatchValidationSchema.safeParse(
      req.body,
    );

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
        endpoint: PAYMENT_METHOD_ENDPOINTS.DELETE_PAYMENT_METHODS_BATCH,
      };
    }

    const { ids } = validation.data;

    // Check which payment methods exist and are not already deleted
    const existingPaymentMethods = await db
      .select()
      .from(paymentMethodTable)
      .where(inArray(paymentMethodTable.id, ids));

    const existingIds = existingPaymentMethods
      .filter((pm) => !pm.isDeleted)
      .map((pm) => pm.id);

    if (existingIds.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "No valid payment methods found to delete",
        endpoint: PAYMENT_METHOD_ENDPOINTS.DELETE_PAYMENT_METHODS_BATCH,
      };
    }

    // Soft delete payment method records
    const deletedPaymentMethods = await db
      .update(paymentMethodTable)
      .set({
        isDeleted: true,
        isActive: false,
        updatedAt: new Date(),
      })
      .where(inArray(paymentMethodTable.id, existingIds))
      .returning();

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedPaymentMethods.length} payment method records`,
      data: deletedPaymentMethods,
    });
  } catch (error) {
    handleError(
      error,
      res,
      PAYMENT_METHOD_ENDPOINTS.DELETE_PAYMENT_METHODS_BATCH,
    );
  }
};
