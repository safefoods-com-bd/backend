import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { ordersTable } from "@/db/schema";

import {
  deleteOrdersBatchValidationSchema,
  deleteOrderValidationSchema,
} from "../orders.validation";
import { eq, inArray, and } from "drizzle-orm";

import productOrdersTable from "@/db/schema/order-management/products_orders";
import { ORDER_ENDPOINTS } from "@/data/endpoints";

/**
 * Soft deletes a single order and its product orders
 * @param req Express request object containing order ID in body
 * @param res Express response object
 * @returns JSON response indicating deletion success or error message
 */
export const deleteOrderV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteOrderValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: ORDER_ENDPOINTS.DELETE_ORDER,
      };
    }

    const { id } = validationResult.data;

    // Check if order exists and is not deleted
    const existingOrder = await db
      .select()
      .from(ordersTable)
      .where(and(eq(ordersTable.id, id), eq(ordersTable.isDeleted, false)));

    if (existingOrder.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Order not found",
        endpoint: ORDER_ENDPOINTS.DELETE_ORDER,
      };
    }

    // Prevent deletion of shipped or delivered orders
    if (["shipped", "delivered"].includes(existingOrder[0].orderStatus)) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Cannot delete shipped or delivered orders",
        endpoint: ORDER_ENDPOINTS.DELETE_ORDER,
      };
    }

    // Soft delete order and product orders in transaction
    const result = await db.transaction(async (tx) => {
      const deletedOrder = await tx
        .update(ordersTable)
        .set({ isDeleted: true, updatedAt: new Date() })
        .where(eq(ordersTable.id, id))
        .returning();

      await tx
        .update(productOrdersTable)
        .set({ isDeleted: true, updatedAt: new Date() })
        .where(eq(productOrdersTable.orderId, id));

      return deletedOrder;
    });

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: result[0],
    });
  } catch (error) {
    handleError(error, res, ORDER_ENDPOINTS.DELETE_ORDER);
  }
};

/**
 * Soft deletes multiple orders and their product orders in a batch operation
 * @param req Express request object containing array of order IDs in body
 * @param res Express response object
 * @returns JSON response indicating batch deletion success or error message
 */
export const deleteOrdersBatchV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteOrdersBatchValidationSchema.safeParse(
      req.body,
    );

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: ORDER_ENDPOINTS.DELETE_ORDERS_BATCH,
      };
    }

    const { ids } = validationResult.data;

    // Check for shipped or delivered orders
    const orders = await db
      .select()
      .from(ordersTable)
      .where(
        and(inArray(ordersTable.id, ids), eq(ordersTable.isDeleted, false)),
      );
    const invalidOrders = orders.filter((o) =>
      ["shipped", "delivered"].includes(o.orderStatus),
    );
    if (invalidOrders.length > 0) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: `Cannot delete shipped or delivered orders: ${invalidOrders
          .map((o) => o.id)
          .join(", ")}`,
        endpoint: ORDER_ENDPOINTS.DELETE_ORDERS_BATCH,
      };
    }

    // Soft delete orders and product orders in transaction
    const deletedOrders = await db.transaction(async (tx) => {
      const deletedOrders = await tx
        .update(ordersTable)
        .set({ isDeleted: true, updatedAt: new Date() })
        .where(inArray(ordersTable.id, ids))
        .returning();

      await tx
        .update(productOrdersTable)
        .set({ isDeleted: true, updatedAt: new Date() })
        .where(inArray(productOrdersTable.orderId, ids));

      return deletedOrders;
    });

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedOrders.length} orders`,
      data: deletedOrders,
    });
  } catch (error) {
    handleError(error, res, ORDER_ENDPOINTS.DELETE_ORDERS_BATCH);
  }
};
